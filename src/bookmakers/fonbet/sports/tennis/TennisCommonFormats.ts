import {CommonFormats} from "../../../../types/Odds";
import {FonbetGeneral} from "../../FonbetGeneral";


export namespace TennisCommonFormats {

  export class Factor implements CommonFormats.Factor {
    constructor(sport: FonbetGeneral.Sport, event: FonbetGeneral.Event, factor: FonbetGeneral.Factor) {
      this.value = factor.v;

      this.extra = {
        eventId: event.id.toString(),
        sportId: sport.id.toString()
      };

      this.event = {
        sport: sport.sport!,
        league: sport.name.substring(sport.name.indexOf(".") + 2),
        firstName: event.team1!,
        secondName: event.team2!,
      };

      this.scope = {
        type: CommonFormats.ScopeType.MATCH
      };

      this.betType = {
        type: CommonFormats.EBetType.WIN,
        outcome: []
      };

      let set = 0;

      if (event.name !== "") {
        const setNameMatches = event.name.match(/(\d)(st|nd|rd)\sset/mi);
        if (setNameMatches) {
          set = parseInt( setNameMatches[1] );
          this.scope = {
            type: CommonFormats.ScopeType.SET,
            set: set
          };
        }
      }

      if (factor.title === "1X2") {

        const outcome = factor.outcome === "1" ? CommonFormats.Outcome.ONE :
          factor.outcome === "2" ? CommonFormats.Outcome.TWO : CommonFormats.Outcome.X;

        this.betType = {
          type: CommonFormats.EBetType.WIN,
          outcome: [outcome]
        }
      }

      if (factor.title === "Total" || factor.title === "Totals") {
        if (factor.subtitle === "") {
          this.betType = {
            type: CommonFormats.EBetType.TOTAL,
            subject: CommonFormats.ETotalSubject.ALL,
            direction: factor.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
            total: parseFloat(factor.pt)
          }
        }
      }

      if (factor.title === "Team Totals-1") {
        if (factor.subtitle === "") {
          this.betType = {
            type: CommonFormats.EBetType.TOTAL,
            subject: CommonFormats.ETotalSubject.TEAM1,
            direction: factor.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
            total: parseFloat(factor.pt)
          }
        }
      }

      if (factor.title === "Team Totals-2") {
        if (factor.subtitle === "") {
          this.betType = {
            type: CommonFormats.EBetType.TOTAL,
            subject: CommonFormats.ETotalSubject.TEAM2,
            direction: factor.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
            total: parseFloat(factor.pt)
          }
        }
      }

      if (factor.title === "By games" || factor.title === "Hcap") {
        const side = factor.outcome === "1" ? CommonFormats.EHandicapSide.TEAM1 : CommonFormats.EHandicapSide.TEAM2;

        this.betType = {
          type: CommonFormats.EBetType.HANDICAP,
          side: side,
          handicap: parseFloat(factor.pt)
        };
      }

      if (factor.title === "Games" && factor.subtitle === "Game %P") {
        const outcome =
          factor.outcome === "%1" ? CommonFormats.Outcome.ONE : CommonFormats.Outcome.TWO;

        this.scope = {
          type: CommonFormats.ScopeType.GAME,
          set: set,
          game: parseInt(factor.pt)
        };
        this.betType = {
          type: CommonFormats.EBetType.WIN,
          outcome: [outcome]
        };
      }

      if (factor.title === "Games special") {
        this.scope = {
          type: CommonFormats.ScopeType.GAME,
          set: set,
          game: parseInt(factor.pt)
        };
        this.betType = {
          type: CommonFormats.EBetType.TWO_WAY,
          subject: factor.subtitle.replace("%P", factor.pt),
          result: factor.outcome === "yes"
        }
      }
    }

    event: CommonFormats.SportEvent;
    scope: CommonFormats.Scope;
    betType: CommonFormats.BetType;
    bookmaker = CommonFormats.Bookmaker.FONBET;
    value: number;
    updated = new Date().getTime().toString();
    extra: CommonFormats.ExtraData;
    deleted = false;
  }
}
