"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const report_salary_controller_1 = __importDefault(require("../controllers/report.salary.controller"));
class SalaryExpenseRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.salaryExpenseController = new report_salary_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get salary report
        this.router.route("/").get(this.salaryExpenseController.getSalaryReport);
    }
}
exports.default = SalaryExpenseRouter;
//# sourceMappingURL=report.salary.router.js.map