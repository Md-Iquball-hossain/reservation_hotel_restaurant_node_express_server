import AbstractRouter from "../../abstarcts/abstract.router";
import FoodController from "../controllers/food.controller";

class FoodRouter extends AbstractRouter {
  private Controller = new FoodController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // Food
    this.router
      .route("/")
      .post(this.Controller.createFood)
      .get(this.Controller.getAllFood);

    // pur-item
    this.router.route("/pur-item").get(this.Controller.getAllPurchaseIngItem);

    // Single Food
    this.router
      .route("/:id")
      .get(this.Controller.getSingleFood)
      .patch(this.Controller.updateFood);
  }
}
export default FoodRouter;
