"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Odds_1 = require("../../../../types/Odds");
var TennisCommonFormats;
(function (TennisCommonFormats) {
    var Factor = /** @class */ (function () {
        function Factor(sport, event, factor) {
            this.bookmaker = Odds_1.CommonFormats.Bookmaker.FONBET;
            this.updated = new Date().getTime().toString();
            this.deleted = false;
            this.value = factor.v;
            this.extra = {
                eventId: event.id.toString(),
                sportId: sport.id.toString()
            };
            this.event = {
                sport: sport.sport,
                league: sport.name.substring(sport.name.indexOf(".") + 2),
                firstName: event.team1,
                secondName: event.team2,
            };
            this.scope = {
                type: Odds_1.CommonFormats.ScopeType.MATCH
            };
            this.betType = {
                type: Odds_1.CommonFormats.EBetType.WIN,
                outcome: []
            };
            var set = 0;
            if (event.name !== "") {
                var setNameMatches = event.name.match(/(\d)(st|nd|rd)\sset/mi);
                if (setNameMatches) {
                    set = parseInt(setNameMatches[1]);
                    this.scope = {
                        type: Odds_1.CommonFormats.ScopeType.SET,
                        set: set
                    };
                }
            }
            if (factor.title === "1X2") {
                var outcome = factor.outcome === "1" ? Odds_1.CommonFormats.Outcome.ONE :
                    factor.outcome === "2" ? Odds_1.CommonFormats.Outcome.TWO : Odds_1.CommonFormats.Outcome.X;
                this.betType = {
                    type: Odds_1.CommonFormats.EBetType.WIN,
                    outcome: [outcome]
                };
            }
            if (factor.title === "Total" || factor.title === "Totals") {
                if (factor.subtitle === "") {
                    this.betType = {
                        type: Odds_1.CommonFormats.EBetType.TOTAL,
                        subject: Odds_1.CommonFormats.ETotalSubject.ALL,
                        direction: factor.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                        total: parseFloat(factor.pt)
                    };
                }
            }
            if (factor.title === "Team Totals-1") {
                if (factor.subtitle === "") {
                    this.betType = {
                        type: Odds_1.CommonFormats.EBetType.TOTAL,
                        subject: Odds_1.CommonFormats.ETotalSubject.TEAM1,
                        direction: factor.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                        total: parseFloat(factor.pt)
                    };
                }
            }
            if (factor.title === "Team Totals-2") {
                if (factor.subtitle === "") {
                    this.betType = {
                        type: Odds_1.CommonFormats.EBetType.TOTAL,
                        subject: Odds_1.CommonFormats.ETotalSubject.TEAM2,
                        direction: factor.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                        total: parseFloat(factor.pt)
                    };
                }
            }
            if (factor.title === "By games" || factor.title === "Hcap") {
                var side = factor.outcome === "1" ? Odds_1.CommonFormats.EHandicapSide.TEAM1 : Odds_1.CommonFormats.EHandicapSide.TEAM2;
                this.betType = {
                    type: Odds_1.CommonFormats.EBetType.HANDICAP,
                    side: side,
                    handicap: parseFloat(factor.pt)
                };
            }
            if (factor.title === "Games" && factor.subtitle === "Game %P") {
                var outcome = factor.outcome === "%1" ? Odds_1.CommonFormats.Outcome.ONE : Odds_1.CommonFormats.Outcome.TWO;
                this.scope = {
                    type: Odds_1.CommonFormats.ScopeType.GAME,
                    set: set,
                    game: parseInt(factor.pt)
                };
                this.betType = {
                    type: Odds_1.CommonFormats.EBetType.WIN,
                    outcome: [outcome]
                };
            }
            if (factor.title === "Games special") {
                this.scope = {
                    type: Odds_1.CommonFormats.ScopeType.GAME,
                    set: set,
                    game: parseInt(factor.pt)
                };
                this.betType = {
                    type: Odds_1.CommonFormats.EBetType.TWO_WAY,
                    subject: factor.subtitle.replace("%P", factor.pt),
                    result: factor.outcome === "yes"
                };
            }
        }
        return Factor;
    }());
    TennisCommonFormats.Factor = Factor;
})(TennisCommonFormats = exports.TennisCommonFormats || (exports.TennisCommonFormats = {}));
//# sourceMappingURL=TennisCommonFormats.js.map