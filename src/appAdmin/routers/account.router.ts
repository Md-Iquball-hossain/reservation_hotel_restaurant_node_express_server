import AbstractRouter from "../../abstarcts/abstract.router";
import AccountController from "../controllers/account.controller";

class AccountRouter extends AbstractRouter {
  private accountController;
  constructor() {
    super();
    this.accountController = new AccountController();
    this.callRouter();
  }
  private callRouter() {
    // create account and get all account
    this.router
      .route("/")
      .post(this.accountController.createAccount)
      .get(this.accountController.getAllAccount);

    // transfer balance to other account
    this.router
      .route("/balance-transfer")
      .post(this.accountController.balanceTransfer);

    // update account
    this.router.route("/:id").patch(this.accountController.updateAccount);
  }
}
export default AccountRouter;
