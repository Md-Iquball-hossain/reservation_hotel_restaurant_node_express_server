"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const reports_controller_1 = __importDefault(require("../controllers/reports.controller"));
class InvoiceReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.reportController = new reports_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get Invoice report router
        this.router.route("/").get(this.reportController.getAllInvoiceReportController);
    }
}
exports.default = InvoiceReportRouter;
//# sourceMappingURL=invoiceReport.router%20copy.js.map