"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const report_client_ledger_controller_1 = __importDefault(require("../controllers/report.client-ledger.controller"));
class ClientLegderReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.clientLedgerReportController = new report_client_ledger_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get hall Booking report router
        this.router.route("/")
            .get(this.clientLedgerReportController.getClientLedgerReport);
    }
}
exports.default = ClientLegderReportRouter;
//# sourceMappingURL=report.client-ledger.router.js.map