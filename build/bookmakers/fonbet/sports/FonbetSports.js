"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Odds_1 = require("../../../types/Odds");
var FonbetSports;
(function (FonbetSports) {
    FonbetSports.sports = {
        SOCCER: {
            id: 1,
            sport: Odds_1.CommonFormats.Sport.SOCCER
        },
        BASKETBALL: {
            id: 3,
            sport: Odds_1.CommonFormats.Sport.BASKETBALL
        },
        TENNIS: {
            id: 4,
            sport: Odds_1.CommonFormats.Sport.TENNIS
        }
    };
    var Tennis = /** @class */ (function () {
        function Tennis(sportEvent, sport, event, factor, factorInfo) {
            this.id = 4;
            var scope = {
                type: Odds_1.CommonFormats.ScopeType.MATCH
            };
            var betType = {
                type: Odds_1.CommonFormats.EBetType.WIN,
                outcome: []
            };
            var set = 0;
            if (event.name !== "") {
                var setNameMatches = event.name.match(/(\d)(st|nd|rd)\sset/mi);
                if (setNameMatches) {
                    set = parseInt(setNameMatches[1]);
                    scope = {
                        type: Odds_1.CommonFormats.ScopeType.SET,
                        set: set
                    };
                }
            }
            if (factorInfo.title === "1X2") {
                var outcome = factorInfo.outcome === "1" ? Odds_1.CommonFormats.Outcome.ONE :
                    factorInfo.outcome === "2" ? Odds_1.CommonFormats.Outcome.TWO : Odds_1.CommonFormats.Outcome.X;
                betType = {
                    type: Odds_1.CommonFormats.EBetType.WIN,
                    outcome: [outcome]
                };
            }
            if (factorInfo.title === "Total" || factorInfo.title === "Totals") {
                if (factorInfo.subtitle === "") {
                    betType = {
                        type: Odds_1.CommonFormats.EBetType.TOTAL,
                        subject: Odds_1.CommonFormats.ETotalSubject.ALL,
                        direction: factorInfo.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                        total: parseFloat(factor.pt)
                    };
                }
            }
            if (factorInfo.title === "Team Totals-1") {
                if (factorInfo.subtitle === "") {
                    betType = {
                        type: Odds_1.CommonFormats.EBetType.TOTAL,
                        subject: Odds_1.CommonFormats.ETotalSubject.TEAM1,
                        direction: factorInfo.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                        total: parseFloat(factor.pt)
                    };
                }
            }
            if (factorInfo.title === "Team Totals-2") {
                if (factorInfo.subtitle === "") {
                    betType = {
                        type: Odds_1.CommonFormats.EBetType.TOTAL,
                        subject: Odds_1.CommonFormats.ETotalSubject.TEAM2,
                        direction: factorInfo.outcome === "O" ? Odds_1.CommonFormats.ETotalDirection.OVER : Odds_1.CommonFormats.ETotalDirection.UNDER,
                        total: parseFloat(factor.pt)
                    };
                }
            }
            if (factorInfo.title === "By games" || factorInfo.title === "Hcap") {
                var side = factorInfo.outcome === "1" ? Odds_1.CommonFormats.EHandicapSide.TEAM1 : Odds_1.CommonFormats.EHandicapSide.TEAM2;
                betType = {
                    type: Odds_1.CommonFormats.EBetType.HANDICAP,
                    side: side,
                    handicap: parseFloat(factor.pt)
                };
            }
            if (factorInfo.title === "Games" && factorInfo.subtitle === "Game %P") {
                var outcome = factorInfo.outcome === "%1" ? Odds_1.CommonFormats.Outcome.ONE : Odds_1.CommonFormats.Outcome.TWO;
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
            if (factorInfo.title === "Games special") {
                scope = {
                    type: Odds_1.CommonFormats.ScopeType.GAME,
                    set: set,
                    game: parseInt(factor.pt)
                };
                betType = {
                    type: Odds_1.CommonFormats.EBetType.TWO_WAY,
                    subject: factorInfo.subtitle.replace("%P", factor.pt),
                    result: factorInfo.outcome === "yes"
                };
            }
            this.factor = {
                event: sportEvent,
                scope: scope,
                betType: betType,
                bookmaker: Odds_1.CommonFormats.Bookmaker.FONBET,
                value: factor.v,
                updated: new Date().getTime().toString(),
                extra: {
                    eventId: event.id.toString(),
                    sportId: sport.id.toString()
                },
                deleted: false
            };
        }
        return Tennis;
    }());
    FonbetSports.Tennis = Tennis;
})(FonbetSports = exports.FonbetSports || (exports.FonbetSports = {}));
//# sourceMappingURL=FonbetSports.js.map