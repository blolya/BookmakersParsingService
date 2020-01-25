import {CommonFormats} from "../../../../types/Odds";
import {FonbetGeneral} from "../../FonbetGeneral";


export namespace BasketballCommonFormats {

  export class Factor implements CommonFormats.Factor {

    constructor(sport: FonbetGeneral.Sport, event: FonbetGeneral.Event, factor: FonbetGeneral.Factor) {
      this.value = factor.v;

      this.extra = {
        eventId: event.id.toString(),
        sportId: sport.id.toString(),
        eventParentId: event.parentId
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

      let quarter = 0;

      if (event.name !== "") {
        const quarterNameMatches = event.name.match(/(\d)(st|nd|rd|th)\squarter/mi);
        if (quarterNameMatches) {
          quarter = parseInt(quarterNameMatches[1]);
          this.scope = {
            type: CommonFormats.ScopeType.QUARTER,
            quarter: quarter
          };
        }
      }

      if (factor.title === "1X2") {

        const outcome =
          factor.outcome === "1" ? [CommonFormats.Outcome.ONE] :
            factor.outcome === "2" ? [CommonFormats.Outcome.TWO] :
              factor.outcome === "X" ? [CommonFormats.Outcome.X] :
                factor.outcome === "1X" ? [CommonFormats.Outcome.ONE, CommonFormats.Outcome.X] :
                  factor.outcome === "X2" ? [CommonFormats.Outcome.X, CommonFormats.Outcome.TWO] :
                    [CommonFormats.Outcome.ONE, CommonFormats.Outcome.TWO];

        this.betType = {
          type: CommonFormats.EBetType.WIN,
          outcome: outcome
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
