import AbstractRouter from "../../abstarcts/abstract.router";
import PurchaseController from "../controllers/purchase.controller";

class PurchaseRouter extends AbstractRouter {
  private Controller = new PurchaseController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // create purchase and get all purchase
    this.router
      .route("/")
      .post(this.Controller.createPurchase)
      .get(this.Controller.getAllPurchase);

    // Single Purchase
    this.router.route("/:id").get(this.Controller.getSinglePurchase);
  }
}
export default PurchaseRouter;
