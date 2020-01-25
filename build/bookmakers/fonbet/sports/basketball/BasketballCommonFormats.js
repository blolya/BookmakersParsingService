"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Odds_1 = require("../../../../types/Odds");
var BasketballCommonFormats;
(function (BasketballCommonFormats) {
    var Factor = /** @class */ (function () {
        function Factor(sport, event, factor) {
            this.bookmaker = Odds_1.CommonFormats.Bookmaker.FONBET;
            this.updated = new Date().getTime().toString();
            this.deleted = false;
            this.value = factor.v;
            this.extra = {
                eventId: event.id.toString(),
                sportId: sport.id.toString(),
                eventParentId: event.parentId
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
            var quarter = 0;
            if (event.name !== "") {
                var quarterNameMatches = event.name.match(/(\d)(st|nd|rd|th)\squarter/mi);
                if (quarterNameMatches) {
                    quarter = parseInt(quarterNameMatches[1]);
                    this.scope = {
                        type: Odds_1.CommonFormats.ScopeType.QUARTER,
                        quarter: quarter
                    };
                }
            }
            if (factor.title === "1X2") {
                var outcome = factor.outcome === "1" ? [Odds_1.CommonFormats.Outcome.ONE] :
                    factor.outcome === "2" ? [Odds_1.CommonFormats.Outcome.TWO] :
                        factor.outcome === "X" ? [Odds_1.CommonFormats.Outcome.X] :
                            factor.outcome === "1X" ? [Odds_1.CommonFormats.Outcome.ONE, Odds_1.CommonFormats.Outcome.X] :
                                factor.outcome === "X2" ? [Odds_1.CommonFormats.Outcome.X, Odds_1.CommonFormats.Outcome.TWO] :
                                    [Odds_1.CommonFormats.Outcome.ONE, Odds_1.CommonFormats.Outcome.TWO];
                this.betType = {
                    type: Odds_1.CommonFormats.EBetType.WIN,
                    outcome: outcome
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
        }
        return Factor;
    }());
    BasketballCommonFormats.Factor = Factor;
})(BasketballCommonFormats = exports.BasketballCommonFormats || (exports.BasketballCommonFormats = {}));
//# sourceMappingURL=BasketballCommonFormats.js.map