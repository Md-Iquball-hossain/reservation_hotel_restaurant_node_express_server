import AbstractRouter from "../../abstarcts/abstract.router";
import ExpenseResController from "../controllers/expense.controller";

class ExpenseResRouter extends AbstractRouter {
  public expenseController;

  constructor() {
    super();
    this.expenseController = new ExpenseResController();
    this.callRouter();
  }

  private callRouter() {
    // Create and get expense router
    this.router
      .route("/")
      .post(this.expenseController.createExpense)
      .get(this.expenseController.getAllExpense);

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

    // Single expense router
    this.router.route("/:id").get(this.expenseController.getSingleExpense);
  }
}

export default ExpenseResRouter;
