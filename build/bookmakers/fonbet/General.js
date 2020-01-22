"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sports = require("./sports/sports");
var General;
(function (General) {
    var SportEvent = /** @class */ (function () {
        function SportEvent(sport, sportName, mainEvent) {
            this.sport = sports[sportName].sport;
            this.league = sport.name.substring(sport.name.indexOf(".") + 2);
            this.firstName = mainEvent.team1;
            this.secondName = mainEvent.team2;
        }
        return SportEvent;
    }());
    General.SportEvent = SportEvent;
})(General = exports.General || (exports.General = {}));
//# sourceMappingURL=General.js.map