"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const accountReport_controller_1 = __importDefault(require("../controllers/accountReport.controller"));
class AccountReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.reportController = new accountReport_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get all account report
        this.router.route("/").get(this.reportController.getAccountReport);
    }
}
exports.default = AccountReportRouter;
//# sourceMappingURL=accountReport.router.js.map