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
var events_1 = require("events");
var BookmakerParsingService = /** @class */ (function (_super) {
    __extends(BookmakerParsingService, _super);
    function BookmakerParsingService() {
        return _super.call(this) || this;
    }
    BookmakerParsingService.prototype.subscribeToSport = function (sport) { };
    BookmakerParsingService.prototype.subscribeToSports = function (sports) {
        var _this = this;
        sports.forEach(function (sport) {
            _this.subscribeToSport(sport);
        });
    };
    BookmakerParsingService.prototype.unsubscribeFromSport = function (sport) { };
    BookmakerParsingService.prototype.unsubscribeFromSports = function (sports) {
        var _this = this;
        sports.forEach(function (sport) {
            _this.unsubscribeFromSport(sport);
        });
    };
    return BookmakerParsingService;
}(events_1.EventEmitter));
exports.BookmakerParsingService = BookmakerParsingService;
//# sourceMappingURL=BookmakerParsingService.js.map