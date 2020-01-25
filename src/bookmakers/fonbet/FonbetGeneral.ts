import {CommonFormats} from "../../types/Odds";
import {Update} from "./updates/Update";
import {FonbetSports} from "./sports/FonbetSports";
import {FactorsCatalogUpdate} from "./updates/FactorsCatalogUpdate";


export namespace FonbetGeneral {

  export class Factor {
    constructor(factorUpdate: Update.Factor, factorInfo: FactorsCatalogUpdate.Extrass) {
      this.e = factorUpdate.e;
      this.f = factorUpdate.f;
      this.v = factorUpdate.v;
      this.p = factorUpdate.p;
      this.pt = factorUpdate.pt;
      this.isLive = factorUpdate.isLive;
      this.title = factorInfo.title;
      this.subtitle = factorInfo.subtitle;
      this.outcome = factorInfo.outcome;
    }
    e: number;
    f: number;
    v: number;
    p: number;
    pt: string;
    isLive: boolean;
    title: string;
    subtitle: string;
    outcome: string;
  }

  export class Event {
    constructor(
      public id: number,
      public sportId: number,
      public team1Id: number,
      public team2Id: number,
      public team1: string | undefined,
      public team2: string | undefined,
      public name: string,
      public parentId?: number | undefined
    ) {}
  }

  export class Sport {
    constructor(
      public id: number,
      public name: string,
      public parentId: number | undefined,
    ) {}

    public sport?: CommonFormats.Sport;
  }

  export class SportEvent implements CommonFormats.SportEvent {
    constructor(sport: Update.Sport, sportName: string, mainEvent: Update.Event) {
      this.sport = FonbetSports.sports[sportName].sport;
      this.league = sport.name.substring(sport.name.indexOf(".") + 2);
      this.firstName = mainEvent.team1;
      this.secondName = mainEvent.team2;
    }

    sport: CommonFormats.Sport;
    league: string;
    firstName: string;
    secondName: string;
  }
}
