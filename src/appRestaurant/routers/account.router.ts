import AbstractRouter from "../../abstarcts/abstract.router";
import RestaurantAccountController from "../controllers/account.controller";

class RestaurantAccountRouter extends AbstractRouter {
    private Controller = new RestaurantAccountController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    // create account and get all account
    this.router
    .route("/")
    .post(this.Controller.createAccount)
    .get(this.Controller.getAllAccount);

    // transfer balance to other account
    this.router
    .route("/balance-transfer")
    .post(this.Controller.balanceTransfer);

    // update account
    this.router.route("/:id").patch(this.Controller.updateAccount);

    }

}
export default RestaurantAccountRouter;