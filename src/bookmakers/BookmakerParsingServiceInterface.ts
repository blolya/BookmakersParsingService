import {CommonFormats} from "../types/Odds";


export interface BookmakerParsingServiceInterface {
  subscribeToSport(sport: CommonFormats.Sport): void
  subscribeToSports(sports: [CommonFormats.Sport]): void

  unsubscribeFromSport(sport: CommonFormats.Sport): void
  unsubscribeFromSports(sports: [CommonFormats.Sport]): void

}
