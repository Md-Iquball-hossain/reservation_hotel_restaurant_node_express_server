"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const report_hall_booking_controller_1 = __importDefault(require("../controllers/report.hall-booking.controller"));
class HallBookingReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.hallBookingReportController = new report_hall_booking_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get hall Booking report router
        this.router.route("/")
            .get(this.hallBookingReportController.getHallBookingReport);
    }
}
exports.default = HallBookingReportRouter;
//# sourceMappingURL=report.hall-booking.router.js.map