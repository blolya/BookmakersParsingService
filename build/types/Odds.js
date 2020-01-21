"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonFormats;
(function (CommonFormats) {
    var Sport;
    (function (Sport) {
        Sport["TENNIS"] = "TENNIS";
        Sport["SOCCER"] = "SOCCER";
        Sport["BASKETBALL"] = "BASKETBALL";
    })(Sport = CommonFormats.Sport || (CommonFormats.Sport = {}));
    var Bookmaker;
    (function (Bookmaker) {
        Bookmaker["FONBET"] = "FONBET";
        Bookmaker["OLIMP"] = "OLIMP";
        Bookmaker["BET365"] = "BET365";
    })(Bookmaker = CommonFormats.Bookmaker || (CommonFormats.Bookmaker = {}));
    var ScopeType;
    (function (ScopeType) {
        ScopeType["MATCH"] = "Scope.Match";
        ScopeType["NUM_SETS"] = "Scope.NumSets";
        ScopeType["SET"] = "Scope.Set";
        ScopeType["GAME"] = "Scope.Game";
        ScopeType["HALF"] = "Scope.Half";
        ScopeType["QUARTER"] = "Scope.Quarter";
    })(ScopeType = CommonFormats.ScopeType || (CommonFormats.ScopeType = {}));
    var EBetType;
    (function (EBetType) {
        EBetType["WIN"] = "BetType.Win";
        EBetType["HANDICAP"] = "BetType.Handicap";
        EBetType["TOTAL"] = "BetType.Total";
        EBetType["PARITY"] = "BetType.Parity";
        EBetType["TWO_WAY"] = "BetType.TwoWay";
    })(EBetType = CommonFormats.EBetType || (CommonFormats.EBetType = {}));
    /**
     * 1 - победит первая
     * Х - ничья
     * 1Х - победа или ничья первой
     * 12 - исключает ничью
     */
    // export type Outcome = '1' | '2' | 'X' | '1X' | '2X' | '12';
    var Outcome;
    (function (Outcome) {
        Outcome["ONE"] = "ONE";
        Outcome["TWO"] = "TWO";
        Outcome["X"] = "X";
    })(Outcome = CommonFormats.Outcome || (CommonFormats.Outcome = {}));
    var EHandicapSide;
    (function (EHandicapSide) {
        EHandicapSide["TEAM1"] = "TEAM1";
        EHandicapSide["TEAM2"] = "TEAM2";
    })(EHandicapSide = CommonFormats.EHandicapSide || (CommonFormats.EHandicapSide = {}));
    var ETotalSubject;
    (function (ETotalSubject) {
        ETotalSubject["ALL"] = "ALL";
        ETotalSubject["TEAM1"] = "TEAM1";
        ETotalSubject["TEAM2"] = "TEAM2";
    })(ETotalSubject = CommonFormats.ETotalSubject || (CommonFormats.ETotalSubject = {}));
    var ETotalDirection;
    (function (ETotalDirection) {
        ETotalDirection["OVER"] = "OVER";
        ETotalDirection["UNDER"] = "UNDER";
        ETotalDirection["EQUAL"] = "EQUAL";
    })(ETotalDirection = CommonFormats.ETotalDirection || (CommonFormats.ETotalDirection = {}));
    var EParity;
    (function (EParity) {
        EParity["ODD"] = "ODD";
        EParity["EVEN"] = "EVEN";
    })(EParity = CommonFormats.EParity || (CommonFormats.EParity = {}));
})(CommonFormats = exports.CommonFormats || (exports.CommonFormats = {}));
//# sourceMappingURL=Odds.js.map