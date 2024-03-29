"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FonbetGeneral;
(function (FonbetGeneral) {
    var Factor = /** @class */ (function () {
        function Factor(factorUpdate, factorInfo) {
            this.e = factorUpdate.e;
            this.f = factorUpdate.f;
            this.v = factorUpdate.v;
            this.p = factorUpdate.p;
            this.pt = factorUpdate.pt;
            this.isLive = factorUpdate.isLive;
            this.title = factorInfo.title;
            this.subtitle = factorInfo.subtitle;
            this.outcome = factorInfo.outcome;
        }
        return Factor;
    }());
    FonbetGeneral.Factor = Factor;
    var Event = /** @class */ (function () {
        function Event(id, sportId, team1Id, team2Id, team1, team2, name, parentId) {
            this.id = id;
            this.sportId = sportId;
            this.team1Id = team1Id;
            this.team2Id = team2Id;
            this.team1 = team1;
            this.team2 = team2;
            this.name = name;
            this.parentId = parentId;
        }
        return Event;
    }());
    FonbetGeneral.Event = Event;
    var Sport = /** @class */ (function () {
        function Sport(id, name, parentId) {
            this.id = id;
            this.name = name;
            this.parentId = parentId;
        }
        return Sport;
    }());
    FonbetGeneral.Sport = Sport;
})(FonbetGeneral = exports.FonbetGeneral || (exports.FonbetGeneral = {}));
//# sourceMappingURL=FonbetGeneral.js.map