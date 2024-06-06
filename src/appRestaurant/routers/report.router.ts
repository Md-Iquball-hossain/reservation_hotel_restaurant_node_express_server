import AbstractRouter from "../../abstarcts/abstract.router";
import ResReportController from "../controllers/report.controller";

class ResReportRouter extends AbstractRouter {
  private Controller = new ResReportController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
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
export default ResReportRouter;
