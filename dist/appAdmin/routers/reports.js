"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const reports_controller_1 = __importDefault(require("../controllers/reports.controller"));
class ReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.reportController = new reports_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get room report router
        this.router.route("/room").get(this.reportController.getRoomReportController);
        // get room Booking report router
        this.router.route("/booking").get(this.reportController.getRoomReportBookingController);
        // get Invoice report router
        this.router.route("/invoice").get(this.reportController.getAllInvoiceReportController);
    }
}
exports.default = ReportRouter;
//# sourceMappingURL=reports.js.map