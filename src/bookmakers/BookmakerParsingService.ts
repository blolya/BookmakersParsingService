import {BookmakerParsingServiceInterface} from "./BookmakerParsingServiceInterface";
import {CommonFormats} from "../types/Odds";
import {EventEmitter} from "events";


export class BookmakerParsingService extends EventEmitter implements BookmakerParsingServiceInterface {
  constructor() {
    super();
  }

  subscribeToSport(sport: CommonFormats.Sport): void {}
  subscribeToSports(sports: [CommonFormats.Sport]): void {
    sports.forEach( (sport: CommonFormats.Sport) => {
      this.subscribeToSport(sport);
    })
  }

  unsubscribeFromSport(sport: CommonFormats.Sport): void {}
  unsubscribeFromSports(sports: [CommonFormats.Sport]): void {
    sports.forEach( (sport: CommonFormats.Sport) => {
      this.unsubscribeFromSport(sport);
    })
  }

}
