import {BookmakerParsingService} from "../BookmakerParsingService";
import {CommonFormats} from "../../types/Odds";
import {Requester} from "../../utils/Requester";
import {FactorsCatalogUpdate} from "./updates/FactorsCatalogUpdate";
import {Update} from "./updates/Update";
import {General} from "./General";
const fonbetSports = require("./sports/sports");


export class FonbetParsingService extends BookmakerParsingService {
  private factorsCatalogRequester: Requester;
  private updatesRequester: Requester;

  private factorsCatalog: { [id: number]: FactorsCatalogUpdate.Extrass } = {};
  private subscribedSports: { [id: number]: Update.Sport } = {};

  private sports: { [id: number]: Update.Sport } = {};
  private events: { [id: number]: Update.Event } = {};
  private factors: { [id: string]: CommonFormats.Factor } = {};

  constructor() {
    super();

    this.factorsCatalogRequester = new Requester(FactorsCatalogUpdate.url, {gzip: true});
    this.factorsCatalogRequester.on("response", rawFactorsCatalog =>
      this.updateFactorsCatalog( JSON.parse(rawFactorsCatalog) ));

    this.updatesRequester = new Requester(Update.url, {gzip: true});
    this.updatesRequester.on("response", rawUpdate => this.handleUpdate( JSON.parse(rawUpdate) ))
  }

  subscribeToSports(sports: CommonFormats.Sport[] = []): void {
    sports.forEach( sport => {
      this.subscribeToSport(sport);
    })
  }

  subscribeToSport(sport?: CommonFormats.Sport): void {
    if (!sport)
      return;

    const sportId = fonbetSports[sport].id;

    if (!this.subscribedSports[sportId])
      this.subscribedSports[sportId] = {
        id: sportId,
        parentId: 0,
        kind: "",
        regionId: 0,
        sortOrder: "",
        name: sport
      };

  }

  private updateFactorsCatalog(factorsCatalogUpdate: FactorsCatalogUpdate.Catalog) {
    // Clear current factors catalog
    this.factorsCatalog = {};

    factorsCatalogUpdate.groups.forEach( (group) => {
      group.tables.forEach( table => {
        const tableHeader: FactorsCatalogUpdate.Row = table.rows[0];
        const tableBody: FactorsCatalogUpdate.Row[] = table.rows.slice(1);

        let subtitle: string = "";

        tableBody.forEach( row => {
          row.forEach( (cell, cellNum) =>{

            if (!table.name) {
              if (cellNum == 0)
                subtitle = cell.name;
              else
                this.factorsCatalog[cell.factorId] = {
                  title: tableHeader[0].name,
                  subtitle: subtitle,
                  outcome: tableHeader[cellNum].name
                }
            } else {

              if (cell.kind === "param")
                subtitle = tableHeader[cellNum].name;
              else if (cell.kind === "value")
                this.factorsCatalog[cell.factorId] = {
                  title: table.name,
                  subtitle: subtitle,
                  outcome: tableHeader[cellNum].name
                };
            }

          })
        });

      });
    });
  }

  private handleUpdate(update: Update.Update) {
    this.updateSports(update.sports);
    this.updateEvents(update.events);
    this.updateFactors(update.customFactors);
    this.pourFactors();
  }

  private updateSports(sportsUpdates: Update.Sport[]) {
    this.sports = {};
    for (let sportId in this.subscribedSports)
      this.sports[sportId] = this.subscribedSports[sportId];

    sportsUpdates.forEach( (sportUpdate: Update.Sport) => {
      // Add a new Sport if it doesn't already exist
      if (!this.sports.hasOwnProperty(sportUpdate.id))
        this.sports[sportUpdate.id] = sportUpdate;
    });
  }

  private updateEvents(eventsUpdates: Update.Event[]) {
    this.events = {};
    eventsUpdates.forEach( (eventUpdate: Update.Event) => this.events[eventUpdate.id] = eventUpdate );
  }

  private updateFactors(factorsUpdates: Update.Factor[]) {
    // Set odds status to outdated
    for (let factorId in this.factors)
      this.factors[factorId].deleted = true;

    factorsUpdates.forEach( factorUpdate => {
      const factor = this.makeFactor(factorUpdate);
      if (factor) this.factors["" + factorUpdate.e + factorUpdate.f] = factor;
    });
  }

  private makeFactor(factorUpdate: Update.Factor): CommonFormats.Factor | null {
    if (!this.events[factorUpdate.e])
      throw Error(`The event #${factorUpdate.e} doesn't exist`);

    const event = this.events[factorUpdate.e];
    const mainEvent = this.getTopEvent(event);

    const sport = this.sports[event.sportId];
    const mainSport = this.getTopSport(sport);

    if (!this.subscribedSports[mainSport.id]) return null;

    const factorInfo = this.factorsCatalog[factorUpdate.f];
    const scopeType = new General.SportEvent(sport, mainSport.name, mainEvent);

    return fonbetSports[mainSport.name].makeFactor(scopeType, sport, event, factorUpdate, factorInfo);
  }

  getTopSport(sport: Update.Sport) {
    let topSport = sport;

    while (topSport.parentId)
      topSport = this.sports[topSport.parentId];

    return topSport;
  }
  getTopEvent(event: Update.Event) {
    let topEvent = event;

    while (topEvent.parentId)
      topEvent = this.events[topEvent.parentId];

    return topEvent;
  }

  private pourFactors() {

    for (let factorsId in this.factors) {
      this.emit("factor", this.factors[factorsId] );

      // Delete outdated odds
      if (this.factors[factorsId].deleted)
        delete this.factors[factorsId];
    }
  }
}
