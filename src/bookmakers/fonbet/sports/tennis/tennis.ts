import {Fonbet} from "../../Fonbet";
import {CommonFormats} from "../../../../types/Odds";


module.exports = {
  id: 4,
  makeOdds: (sport: Fonbet.Sport, event: Fonbet.Event, factor: Fonbet.Factor) => {

    const sportEvent = {
      sport: CommonFormats.Sport.TENNIS,
      league: sport.name.substring(sport.name.indexOf(".") + 2),
      firstName: event.team1,
      secondName: event.team2
    };

    let scope = {
      type: CommonFormats.ScopeType.MATCH,
      set: 0,
      game: 0
    };

    let set = 0;

    if (event.name !== "") {
      const setNameMatches = event.name.match(/(\d)(st|nd|rd)\sset/mi);
      if (setNameMatches) {
        set = parseInt( setNameMatches[1] );

        scope = {
          type: CommonFormats.ScopeType.SET,
          set: set,
          game: 0
        };
      }
    }

    let betType = {};

    if (factor.info.title === "1X2") {

      const outcome = factor.info.outcome === "1" ?CommonFormats.Outcome.ONE :
        factor.info.outcome === "2" ? CommonFormats.Outcome.TWO : "";

      betType = {
        type: CommonFormats.EBetType.WIN,
        outcome: [outcome]
      }
    }

    if (factor.info.title === "Total" || factor.info.title === "Totals") {
      if (factor.info.subtitle === "") {
        betType = {
          type: CommonFormats.EBetType.TOTAL,
          subject: CommonFormats.ETotalSubject.ALL,
          direction: factor.info.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
          total: parseFloat(factor.pt)
        }
      }
    }

    if (factor.info.title === "Team Totals-1") {
      if (factor.info.subtitle === "") {
        betType = {
          type: CommonFormats.EBetType.TOTAL,
          subject: CommonFormats.ETotalSubject.TEAM1,
          direction: factor.info.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
          total: parseFloat(factor.pt)
        }
      }
    }

    if (factor.info.title === "Team Totals-2") {
      if (factor.info.subtitle === "") {
        betType = {
          type: CommonFormats.EBetType.TOTAL,
          subject: CommonFormats.ETotalSubject.TEAM2,
          direction: factor.info.outcome === "O" ? CommonFormats.ETotalDirection.OVER : CommonFormats.ETotalDirection.UNDER,
          total: parseFloat(factor.pt)
        }
      }
    }

    if (factor.info.title === "By games" || factor.info.title === "Hcap") {
      const side = factor.info.outcome === "1" ? CommonFormats.EHandicapSide.TEAM1 :
        factor.info.outcome === "2" ? CommonFormats.EHandicapSide.TEAM2 : "";

      betType = {
        type: CommonFormats.EBetType.HANDICAP,
        side: side,
        handicap: factor.pt
      };
    }

    if (factor.info.title === "Games" && factor.info.subtitle === "Game %P") {
      const outcome =
        factor.info.outcome === "%1" ? CommonFormats.Outcome.ONE :
          factor.info.outcome === "%2" ? CommonFormats.Outcome.TWO : "";

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

    if (factor.info.title === "Games special") {
      scope = {
        type: CommonFormats.ScopeType.GAME,
        set: set,
        game: parseInt(factor.pt)
      };
      betType = {
        type: CommonFormats.EBetType.TWO_WAY,
        subject: factor.info.subtitle.replace("%P", factor.pt),
        result: factor.info.outcome === "yes"
      }
    }
    return {
      event: sportEvent,
      scope: scope,
      betType: betType,
      bookmaker: CommonFormats.Bookmaker.FONBET,
      value: factor.v,
      updated: new Date().getTime(),
      extra: event.parentId ? event.parentId : event.id,
      deleted: false
    };

  }
}
