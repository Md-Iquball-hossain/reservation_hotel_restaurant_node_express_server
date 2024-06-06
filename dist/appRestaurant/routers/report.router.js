"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const report_controller_1 = __importDefault(require("../controllers/report.controller"));
class ResReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new report_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Router ======================//
        // supplier
        this.router.route("/sup-ledger").get(this.Controller.getSupplierLedger);
        // purchase
        this.router.route("/purchase").get(this.Controller.getPurchaseReport);
        // purchase
        this.router
            .route("/food-category")
            .get(this.Controller.getFoodCategoryReport);
        // Sales
        this.router.route("/sales").get(this.Controller.getSalesReport);
        // Expense
        this.router.route("/expense").get(this.Controller.getExpenseReport);
    }
}
exports.default = ResReportRouter;
//# sourceMappingURL=report.router.js.map