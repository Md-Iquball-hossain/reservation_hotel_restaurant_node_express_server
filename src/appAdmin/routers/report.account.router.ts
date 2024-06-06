import AbstractRouter from "../../abstarcts/abstract.router";
import AccountReportController from "../controllers/report.account.controller";

class AccountReportRouter extends AbstractRouter {
  private reportController;
  constructor() {
    super();
    this.reportController = new AccountReportController();
    this.callRouter();
  }
  private callRouter() {
    // get all account report
    this.router.route("/").get(this.reportController.getAccountReport);
  }
}
export default AccountReportRouter;
