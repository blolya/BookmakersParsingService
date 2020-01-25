import {BookmakerParsingService} from "../BookmakerParsingService";
import {CommonFormats} from "../../types/Odds";
import {Requester} from "../../utils/Requester";
import {FactorsCatalogUpdate} from "./updates/FactorsCatalogUpdate";
import {Update} from "./updates/GeneralUpdate";
import {FonbetGeneral} from "./FonbetGeneral";
import {fonbetSports} from "./sports/fonbetSports";
import {TennisCommonFormats} from "./sports/tennis/TennisCommonFormats";
import {BasketballCommonFormats} from "./sports/basketball/BasketballCommonFormats";

export class FonbetParsingService extends BookmakerParsingService {
  private factorsCatalogRequester: Requester;
  private updatesRequester: Requester;

  private factorsCatalog: { [id: number]: FactorsCatalogUpdate.Extrass } = {};
  private subscribedSports: { [id: number]: FonbetGeneral.Sport } = {};

  private sports: { [id: number]: FonbetGeneral.Sport } = {};
  private events: { [id: number]: FonbetGeneral.Event } = {};
  private factors: { [id: string]: CommonFormats.Factor } = {};

  constructor() {
    super();

    this.factorsCatalogRequester = new Requester(FactorsCatalogUpdate.url, {gzip: true});
    this.factorsCatalogRequester.on("response", rawFactorsCatalog =>
      this.updateFactorsCatalog( JSON.parse(rawFactorsCatalog) ));

    this.updatesRequester = new Requester(Update.url, {gzip: true});
    this.updatesRequester.on("response", rawUpdate => this.handleUpdate( JSON.parse(rawUpdate) ))
  }

  subscribeToSports(sports: CommonFormats.Sport[] = []) {
    sports.forEach( sport => {
      this.subscribeToSport(sport);
    })
  }

  subscribeToSport(sport?: CommonFormats.Sport) {
    if (!sport)
      return;

    const sportId = fonbetSports[sport].id;

    if (!this.subscribedSports[sportId])
      this.subscribedSports[sportId] = {
        id: sportId,
        parentId: 0,
        name: sport,
        sport: sport
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
        this.sports[sportUpdate.id] =
          new FonbetGeneral.Sport(sportUpdate.id, sportUpdate.name, sportUpdate.parentId);
    });
  }

  private updateEvents(eventsUpdates: Update.Event[]) {
    this.events = {};
    eventsUpdates.forEach( (eventUpdate: Update.Event) => {
      this.events[eventUpdate.id] =
        new FonbetGeneral.Event(
          eventUpdate.id,
          eventUpdate.sportId,
          eventUpdate.team1Id,
          eventUpdate.team2Id,
          eventUpdate.team1,
          eventUpdate.team2,
          eventUpdate.name,
          eventUpdate.parentId
        )
    } );
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
    event.team1 = mainEvent.team1;
    event.team2 = mainEvent.team2;
    event.team1Id = mainEvent.team1Id;
    event.team2Id = mainEvent.team2Id;

    const sport = this.sports[event.sportId];
    const mainSport = this.getTopSport(sport);
    sport.sport = mainSport.sport;
    if (!this.subscribedSports[mainSport.id]) return null;

    const factorInfo = this.factorsCatalog[factorUpdate.f];
    const factor = new FonbetGeneral.Factor(factorUpdate, factorInfo);

    if (sport.sport === CommonFormats.Sport.TENNIS) {
      return new TennisCommonFormats.Factor(sport, event, factor);
    }
    if (sport.sport === CommonFormats.Sport.BASKETBALL) {
      return new BasketballCommonFormats.Factor(sport, event, factor);
    }

    return null;
  }

  getTopSport(sport: FonbetGeneral.Sport) {
    let topSport = sport;

    while (topSport.parentId)
      topSport = this.sports[topSport.parentId];

    return topSport;
  }
  getTopEvent(event: FonbetGeneral.Event) {
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
