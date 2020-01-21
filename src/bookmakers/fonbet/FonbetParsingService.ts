import {BookmakerParsingService} from "../BookmakerParsingService";
import {CommonFormats} from "../../types/Odds";
import {Requester} from "../../utils/Requester";
import {FactorsCatalog} from "./FactorsCatalog";
import {Fonbet} from "./Fonbet";
const fonbetSports = require("./sports/sports");


export class FonbetParsingService extends BookmakerParsingService {
  private factorsCatalog: { [id: number]: FactorsCatalog.FactorExtrass } = {};
  private factorsCatalogRequester: Requester;

  private subscribedSports: { [id: number]: Fonbet.Sport } = {};
  private sports: { [id: number]: Fonbet.Sport } = {};
  private events: { [id: number]: Fonbet.Event } = {};
  private factors: { [id: string]: CommonFormats.Factor } = {};

  private updatesRequester: Requester;

  constructor() {
    super();

    this.factorsCatalogRequester = new Requester("https://line11.bkfon-resource.ru/line/factorsCatalog/tables/?lang=en&version=0", {gzip: true});
    this.factorsCatalogRequester.on("response", rawFactorsCatalog =>
      this.updateFactorsCatalog( JSON.parse(rawFactorsCatalog) ));

    this.updatesRequester = new Requester("https://line01i.bkfon-resource.ru/live/updatesFromVersion/3184630894/en", {gzip: true});
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

  private updateFactorsCatalog(factorsCatalogUpdate: FactorsCatalog.FactorsCatalogUpdate) {
    // Clear current factors catalog
    this.factorsCatalog = {};

    factorsCatalogUpdate.groups.forEach( (group) => {
      group.tables.forEach( table => {

        const tableHeader: FactorsCatalog.FactorsCatalogUpdateRow = table.rows[0];
        const tableBody: FactorsCatalog.FactorsCatalogUpdateRow[] = table.rows.slice(1);

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

  private handleUpdate(update: Fonbet.Update) {
    this.updateSports(update.sports);
    this.updateEvents(update.events);
    this.updateFactors(update.customFactors);
    this.pourFactors();
  }

  private updateSports(sportsUpdates: Fonbet.Sport[]) {
    this.sports = {};
    for (let sportId in this.subscribedSports)
      this.sports[sportId] = this.subscribedSports[sportId];

    sportsUpdates.forEach( (sportUpdate: Fonbet.Sport) => {
      // Add a new Sport if it doesn't already exist
      if (!this.sports.hasOwnProperty(sportUpdate.id))
        this.sports[sportUpdate.id] = sportUpdate;
    });
  }

  private updateEvents(eventsUpdates: Fonbet.Event[]) {
    this.events = {};
    eventsUpdates.forEach( (eventUpdate: Fonbet.Event) => this.events[eventUpdate.id] = eventUpdate );
  }

  private updateFactors(factorsUpdates: Fonbet.Factor[]) {
    // Set odds status to outdated
    for (let factorId in this.factors)
      this.factors[factorId].deleted = true;

    factorsUpdates.forEach( factorUpdate => {
      const factor = this.makeFactor(factorUpdate);

      if (factor) this.factors["" + factorUpdate.e + factorUpdate.f] = factor;
    });
  }

  private makeFactor(factorUpdate: Fonbet.Factor): CommonFormats.Factor | null {
    if (!this.events[factorUpdate.e])
      throw Error(`The event #${factorUpdate.e} doesn't exist`);

    const event = this.events[factorUpdate.e];
    const mainEvent = this.getTopEvent(event);

    event.team1Id = mainEvent.team1Id;
    event.team2Id = mainEvent.team2Id;
    event.team1 = mainEvent.team1;
    event.team2 = mainEvent.team2;

    const sport = this.sports[event.sportId];
    const mainSport = this.getTopSport(sport);
    sport.mainSportName = mainSport.name;

    factorUpdate.info = this.factorsCatalog[factorUpdate.f];

    if (!this.subscribedSports.hasOwnProperty( mainSport.id )) return null;

    return fonbetSports[sport.mainSportName].makeOdds(sport, event, factorUpdate);
  }

  getTopSport(sport: Fonbet.Sport) {
    let topSport = sport;

    while (topSport.parentId)
      topSport = this.sports[topSport.parentId];

    return topSport;
  }
  getTopEvent(event: Fonbet.Event) {
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
