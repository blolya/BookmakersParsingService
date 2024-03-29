"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BookmakerParsingService_1 = require("../BookmakerParsingService");
var Odds_1 = require("../../types/Odds");
var Requester_1 = require("../../utils/Requester");
var FactorsCatalogUpdate_1 = require("./updates/FactorsCatalogUpdate");
var GeneralUpdate_1 = require("./updates/GeneralUpdate");
var FonbetGeneral_1 = require("./FonbetGeneral");
var fonbetSports_1 = require("./sports/fonbetSports");
var TennisCommonFormats_1 = require("./sports/tennis/TennisCommonFormats");
var BasketballCommonFormats_1 = require("./sports/basketball/BasketballCommonFormats");
var FonbetParsingService = /** @class */ (function (_super) {
    __extends(FonbetParsingService, _super);
    function FonbetParsingService() {
        var _this = _super.call(this) || this;
        _this.factorsCatalog = {};
        _this.subscribedSports = {};
        _this.sports = {};
        _this.events = {};
        _this.factors = {};
        _this.factorsCatalogRequester = new Requester_1.Requester(FactorsCatalogUpdate_1.FactorsCatalogUpdate.url, { gzip: true });
        _this.factorsCatalogRequester.on("response", function (rawFactorsCatalog) {
            return _this.updateFactorsCatalog(JSON.parse(rawFactorsCatalog));
        });
        _this.updatesRequester = new Requester_1.Requester(GeneralUpdate_1.Update.url, { gzip: true });
        _this.updatesRequester.on("response", function (rawUpdate) { return _this.handleUpdate(JSON.parse(rawUpdate)); });
        return _this;
    }
    FonbetParsingService.prototype.subscribeToSports = function (sports) {
        var _this = this;
        if (sports === void 0) { sports = []; }
        sports.forEach(function (sport) {
            _this.subscribeToSport(sport);
        });
    };
    FonbetParsingService.prototype.subscribeToSport = function (sport) {
        if (!sport)
            return;
        var sportId = fonbetSports_1.fonbetSports[sport].id;
        if (!this.subscribedSports[sportId])
            this.subscribedSports[sportId] = {
                id: sportId,
                parentId: 0,
                name: sport,
                sport: sport
            };
    };
    FonbetParsingService.prototype.updateFactorsCatalog = function (factorsCatalogUpdate) {
        var _this = this;
        // Clear current factors catalog
        this.factorsCatalog = {};
        factorsCatalogUpdate.groups.forEach(function (group) {
            group.tables.forEach(function (table) {
                var tableHeader = table.rows[0];
                var tableBody = table.rows.slice(1);
                var subtitle = "";
                tableBody.forEach(function (row) {
                    row.forEach(function (cell, cellNum) {
                        if (!table.name) {
                            if (cellNum == 0)
                                subtitle = cell.name;
                            else
                                _this.factorsCatalog[cell.factorId] = {
                                    title: tableHeader[0].name,
                                    subtitle: subtitle,
                                    outcome: tableHeader[cellNum].name
                                };
                        }
                        else {
                            if (cell.kind === "param")
                                subtitle = tableHeader[cellNum].name;
                            else if (cell.kind === "value")
                                _this.factorsCatalog[cell.factorId] = {
                                    title: table.name,
                                    subtitle: subtitle,
                                    outcome: tableHeader[cellNum].name
                                };
                        }
                    });
                });
            });
        });
    };
    FonbetParsingService.prototype.handleUpdate = function (update) {
        this.updateSports(update.sports);
        this.updateEvents(update.events);
        this.updateFactors(update.customFactors);
        this.pourFactors();
    };
    FonbetParsingService.prototype.updateSports = function (sportsUpdates) {
        var _this = this;
        this.sports = {};
        for (var sportId in this.subscribedSports)
            this.sports[sportId] = this.subscribedSports[sportId];
        sportsUpdates.forEach(function (sportUpdate) {
            // Add a new Sport if it doesn't already exist
            if (!_this.sports.hasOwnProperty(sportUpdate.id))
                _this.sports[sportUpdate.id] =
                    new FonbetGeneral_1.FonbetGeneral.Sport(sportUpdate.id, sportUpdate.name, sportUpdate.parentId);
        });
    };
    FonbetParsingService.prototype.updateEvents = function (eventsUpdates) {
        var _this = this;
        this.events = {};
        eventsUpdates.forEach(function (eventUpdate) {
            _this.events[eventUpdate.id] =
                new FonbetGeneral_1.FonbetGeneral.Event(eventUpdate.id, eventUpdate.sportId, eventUpdate.team1Id, eventUpdate.team2Id, eventUpdate.team1, eventUpdate.team2, eventUpdate.name, eventUpdate.parentId);
        });
    };
    FonbetParsingService.prototype.updateFactors = function (factorsUpdates) {
        var _this = this;
        // Set odds status to outdated
        for (var factorId in this.factors)
            this.factors[factorId].deleted = true;
        factorsUpdates.forEach(function (factorUpdate) {
            var factor = _this.makeFactor(factorUpdate);
            if (factor)
                _this.factors["" + factorUpdate.e + factorUpdate.f] = factor;
        });
    };
    FonbetParsingService.prototype.makeFactor = function (factorUpdate) {
        if (!this.events[factorUpdate.e])
            throw Error("The event #" + factorUpdate.e + " doesn't exist");
        var event = this.events[factorUpdate.e];
        var mainEvent = this.getTopEvent(event);
        event.team1 = mainEvent.team1;
        event.team2 = mainEvent.team2;
        event.team1Id = mainEvent.team1Id;
        event.team2Id = mainEvent.team2Id;
        var sport = this.sports[event.sportId];
        var mainSport = this.getTopSport(sport);
        sport.sport = mainSport.sport;
        if (!this.subscribedSports[mainSport.id])
            return null;
        var factorInfo = this.factorsCatalog[factorUpdate.f];
        var factor = new FonbetGeneral_1.FonbetGeneral.Factor(factorUpdate, factorInfo);
        if (sport.sport === Odds_1.CommonFormats.Sport.TENNIS) {
            return new TennisCommonFormats_1.TennisCommonFormats.Factor(sport, event, factor);
        }
        if (sport.sport === Odds_1.CommonFormats.Sport.BASKETBALL) {
            return new BasketballCommonFormats_1.BasketballCommonFormats.Factor(sport, event, factor);
        }
        return null;
    };
    FonbetParsingService.prototype.getTopSport = function (sport) {
        var topSport = sport;
        while (topSport.parentId)
            topSport = this.sports[topSport.parentId];
        return topSport;
    };
    FonbetParsingService.prototype.getTopEvent = function (event) {
        var topEvent = event;
        while (topEvent.parentId)
            topEvent = this.events[topEvent.parentId];
        return topEvent;
    };
    FonbetParsingService.prototype.pourFactors = function () {
        for (var factorsId in this.factors) {
            this.emit("factor", this.factors[factorsId]);
            // Delete outdated odds
            if (this.factors[factorsId].deleted)
                delete this.factors[factorsId];
        }
    };
    return FonbetParsingService;
}(BookmakerParsingService_1.BookmakerParsingService));
exports.FonbetParsingService = FonbetParsingService;
//# sourceMappingURL=FonbetParsingService.js.map