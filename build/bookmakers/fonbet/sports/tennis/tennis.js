"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Odds_1 = require("../../../../types/Odds");
module.exports = {
    id: 4,
    makeOdds: function (sport, event, factor) {
        var sportEvent = {
            sport: Odds_1.CommonFormats.Sport.TENNIS,
            league: sport.name.substring(sport.name.indexOf(".") + 2),
            firstName: event.team1,
            secondName: event.team2
        };
        var scope = {
            type: Odds_1.CommonFormats.ScopeType.MATCH,
            set: 0,
            game: 0
        };
        var set = 0;
        if (event.name !== "") {
            var setNameMatches = event.name.match(/(\d)(st|nd|rd)\sset/mi);
            if (setNameMatches) {
                set = parseInt(setNameMatches[1]);
                scope = {
                    type: Odds_1.CommonFormats.ScopeType.SET,
                    set: set,
                    game: 0
                };
            }
        }
        var betType = {};
        if (factor.info.title === "1X2") {
            var outcome = factor.info.outcome === "1" ? Odds_1.CommonFormats.Outcome.ONE :
                factor.info.outcome === "2" ? Odds_1.CommonFormats.Outcome.TWO : "";
            betType = {
                type: Odds_1.CommonFormats.EBetType.WIN,
                outcome: [outcome]
            };
        }
        if (factor.info.title === "Total" || factor.info.title === "Totals") {
            if (factor.info.subtitle === "") {
                betType = {
                    type: Odds_1.CommonFormats.EBetType.TOTAL,
                    subject: Odds_1.CommonFormats.ETotalSubject.ALL,
                    direction: factor.info.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                    total: parseFloat(factor.pt)
                };
            }
        }
        if (factor.info.title === "Team Totals-1") {
            if (factor.info.subtitle === "") {
                betType = {
                    type: Odds_1.CommonFormats.EBetType.TOTAL,
                    subject: Odds_1.CommonFormats.ETotalSubject.TEAM1,
                    direction: factor.info.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                    total: parseFloat(factor.pt)
                };
            }
        }
        if (factor.info.title === "Team Totals-2") {
            if (factor.info.subtitle === "") {
                betType = {
                    type: Odds_1.CommonFormats.EBetType.TOTAL,
                    subject: Odds_1.CommonFormats.ETotalSubject.TEAM2,
                    direction: factor.info.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                    total: parseFloat(factor.pt)
                };
            }
        }
        if (factor.info.title === "By games" || factor.info.title === "Hcap") {
            var side = factor.info.outcome === "1" ? Odds_1.CommonFormats.EHandicapSide.TEAM1 :
                factor.info.outcome === "2" ? Odds_1.CommonFormats.EHandicapSide.TEAM2 : "";
            betType = {
                type: Odds_1.CommonFormats.EBetType.HANDICAP,
                side: side,
                handicap: factor.pt
            };
        }
        if (factor.info.title === "Games" && factor.info.subtitle === "Game %P") {
            var outcome = factor.info.outcome === "%1" ? Odds_1.CommonFormats.Outcome.ONE :
                factor.info.outcome === "%2" ? Odds_1.CommonFormats.Outcome.TWO : "";
            scope = {
                type: Odds_1.CommonFormats.ScopeType.GAME,
                set: set,
                game: parseInt(factor.pt)
            };
            betType = {
                type: Odds_1.CommonFormats.EBetType.WIN,
                outcome: [outcome]
            };
        }
        if (factor.info.title === "Games special") {
            scope = {
                type: Odds_1.CommonFormats.ScopeType.GAME,
                set: set,
                game: parseInt(factor.pt)
            };
            betType = {
                type: Odds_1.CommonFormats.EBetType.TWO_WAY,
                subject: factor.info.subtitle.replace("%P", factor.pt),
                result: factor.info.outcome === "yes"
            };
        }
        return {
            event: sportEvent,
            scope: scope,
            betType: betType,
            bookmaker: Odds_1.CommonFormats.Bookmaker.FONBET,
            value: factor.v,
            updated: new Date().getTime(),
            extra: event.parentId ? event.parentId : event.id,
            deleted: false
        };
    }
};
//# sourceMappingURL=tennis.js.map