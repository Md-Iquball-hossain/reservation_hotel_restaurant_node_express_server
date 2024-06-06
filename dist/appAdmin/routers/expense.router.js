"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const expense_controller_1 = __importDefault(require("../controllers/expense.controller"));
class ExpenseRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.expenseController = new expense_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get expense head router
        this.router
            .route("/head")
            .post(this.expenseController.createExpenseHead)
            .get(this.expenseController.getAllExpenseHead);
        // edit and remove expense head router
        this.router
            .route("/head/:id")
            .patch(this.expenseController.updateExpenseHead)
            .delete(this.expenseController.deleteExpenseHead);
        // Create and get expense router
        this.router
            .route("/")
            .post(this.expenseController.createExpense)
            .get(this.expenseController.getAllExpense);
        // Single expense router
        this.router.route("/:id")
            .get(this.expenseController.getSingleExpense);
    }
}
exports.default = ExpenseRouter;
//# sourceMappingURL=expense.router.js.map