"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const expenseReport_controller_1 = __importDefault(require("../controllers/expenseReport.controller"));
class ExpenseReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.expenseReportController = new expenseReport_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // expense report router
        this.router
            .route("/")
            .get(this.expenseReportController.getExpenseReport);
    }
}
exports.default = ExpenseReportRouter;
//# sourceMappingURL=expenseReport.router.js.map