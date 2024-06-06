"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const roomBookingReport_controller_1 = __importDefault(require("../controllers/roomBookingReport.controller"));
class RoomBookingReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.roomBookingReportController = new roomBookingReport_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get room Booking report router
        this.router.route("/")
            .get(this.roomBookingReportController.getRoomBookingReport);
    }
}
exports.default = RoomBookingReportRouter;
//# sourceMappingURL=roomBookingReport.router.js.map