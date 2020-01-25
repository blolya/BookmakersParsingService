"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FonbetParsingService_1 = require("../bookmakers/fonbet/FonbetParsingService");
var Odds_1 = require("../types/Odds");
var main = function () {
    var fps = new FonbetParsingService_1.FonbetParsingService();
    fps.subscribeToSports([Odds_1.CommonFormats.Sport.TENNIS]);
    fps.on("factor", function (factor) {
        if (factor.extra.eventParentId === 19041117)
            if (factor.betType.type === Odds_1.CommonFormats.EBetType.WIN)
                console.log(factor);
    });
};
main();
//# sourceMappingURL=main.js.map