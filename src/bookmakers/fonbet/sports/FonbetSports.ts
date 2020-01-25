import {CommonFormats} from "../../../types/Odds";
import {Update} from "../updates/Update";


export namespace FonbetSports {

  export const sports = {
    SOCCER: {
      id: 1,
      sport: CommonFormats.Sport.SOCCER
    },
    BASKETBALL: {
      id: 3,
      sport: CommonFormats.Sport.BASKETBALL
    },
    TENNIS: {
      id: 4,
      sport: CommonFormats.Sport.TENNIS
    }
  };

  export interface Sport {
    id: number,
    factor: CommonFormats.Factor
  }

  export class Tennis implements Sport {
    constructor(
      sportEvent: CommonFormats.SportEvent,
      sport: Update.Sport,
      event: Update.Event,
      factor: Update.Factor,
      factorInfo: {title: string, subtitle: string, outcome: string}
    ) {

      let scope: CommonFormats.Scope = {
        type: CommonFormats.ScopeType.MATCH
      };

      let betType: CommonFormats.BetType = {
        type: CommonFormats.EBetType.WIN,
        outcome: []
      };

      let set = 0;

      if (event.name !== "") {
        const setNameMatches = event.name.match(/(\d)(st|nd|rd)\sset/mi);
        if (setNameMatches) {
          set = parseInt( setNameMatches[1] );

          scope = {
            type: CommonFormats.ScopeType.SET,
            set: set
          };
        }
      }

      if (factorInfo.title === "1X2") {

        const outcome = factorInfo.outcome === "1" ? CommonFormats.Outcome.ONE :
          factorInfo.outcome === "2" ? CommonFormats.Outcome.TWO : CommonFormats.Outcome.X;

        betType = {
          type: CommonFormats.EBetType.WIN,
          outcome: [outcome]
        }
      }

      if (factorInfo.title === "Total" || factorInfo.title === "Totals") {
        if (factorInfo.subtitle === "") {
          betType = {
            type: CommonFormats.EBetType.TOTAL,
            subject: CommonFormats.ETotalSubject.ALL,
            direction: factorInfo.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
            total: parseFloat(factor.pt)
          }
        }
      }

      if (factorInfo.title === "Team Totals-1") {
        if (factorInfo.subtitle === "") {
          betType = {
            type: CommonFormats.EBetType.TOTAL,
            subject: CommonFormats.ETotalSubject.TEAM1,
            direction: factorInfo.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
            total: parseFloat(factor.pt)
          }
        }
      }

      if (factorInfo.title === "Team Totals-2") {
        if (factorInfo.subtitle === "") {
          betType = {
            type: CommonFormats.EBetType.TOTAL,
            subject: CommonFormats.ETotalSubject.TEAM2,
            direction: factorInfo.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
            total: parseFloat(factor.pt)
          }
        }
      }

      if (factorInfo.title === "By games" || factorInfo.title === "Hcap") {
        const side = factorInfo.outcome === "1" ? CommonFormats.EHandicapSide.TEAM1 : CommonFormats.EHandicapSide.TEAM2;

        betType = {
          type: CommonFormats.EBetType.HANDICAP,
          side: side,
          handicap: parseFloat(factor.pt)
        };
      }

      if (factorInfo.title === "Games" && factorInfo.subtitle === "Game %P") {
        const outcome =
          factorInfo.outcome === "%1" ? CommonFormats.Outcome.ONE : CommonFormats.Outcome.TWO;

        scope = {
          type: CommonFormats.ScopeType.GAME,
          set: set,
          game: parseInt(factor.pt)
        };
        betType = {
          type: CommonFormats.EBetType.WIN,
          outcome: [outcome]
        };
      }

      if (factorInfo.title === "Games special") {
        scope = {
          type: CommonFormats.ScopeType.GAME,
          set: set,
          game: parseInt(factor.pt)
        };
        betType = {
          type: CommonFormats.EBetType.TWO_WAY,
          subject: factorInfo.subtitle.replace("%P", factor.pt),
          result: factorInfo.outcome === "yes"
        }
      }

      this.factor = {
        event: sportEvent,
        scope: scope,
        betType: betType,
        bookmaker: CommonFormats.Bookmaker.FONBET,
        value: factor.v,
        updated: new Date().getTime().toString(),
        extra: {
          eventId: event.id.toString(),
          sportId: sport.id.toString()
        },
        deleted: false
      };

    }

    id: number = 4;
    factor: CommonFormats.Factor;
  }
}
