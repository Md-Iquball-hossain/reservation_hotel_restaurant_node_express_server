import AbstractRouter from "../../abstarcts/abstract.router";
import ExpenseController from "../controllers/expense.controller";

class ExpenseRouter extends AbstractRouter {
  public expenseController;

  constructor() {
    super();
    this.expenseController = new ExpenseController();
    this.callRouter();
  }

  private callRouter() {
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

export default ExpenseRouter;
