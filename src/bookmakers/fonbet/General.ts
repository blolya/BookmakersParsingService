import {CommonFormats} from "../../types/Odds";
import {Update} from "./updates/Update";
const sports = require("./sports/sports");

export namespace General {
  export class SportEvent implements CommonFormats.SportEvent {
    constructor(sport: Update.Sport, sportName: string, mainEvent: Update.Event) {
      this.sport = sports[sportName].sport;
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
