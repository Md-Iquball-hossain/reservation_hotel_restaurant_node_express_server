import AbstractRouter from "../../abstarcts/abstract.router";
import RestaurantController from "../controllers/restaurant.controller";

class RestaurantProfileRouter extends AbstractRouter {
  private Controller = new RestaurantController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.router.route("/").get(this.Controller.getSingleRestaurant);

    // update Restaurant
    this.router
      .route("/")
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.RESTAURANT_FILES),
        this.Controller.updateRestaurant
      );

    // update Restaurant admin
    this.router
      .route("/admin/:id")
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.RESTAURANT_FILES),
        this.Controller.updateResAdmin
      );
  }
}
export default RestaurantProfileRouter;
