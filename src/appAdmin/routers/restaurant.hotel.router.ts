import AbstractRouter from "../../abstarcts/abstract.router";
import hotelRestaurantController from "../controllers/restaurant.hotel.controller";

class hotelRestaurantRouter extends AbstractRouter {
  private Controller = new hotelRestaurantController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //=================== Restaurant Router ======================//

    // Create and View Restaurant
    this.router
      .route("/")
      .post(this.Controller.createRestaurant)
      .get(this.Controller.getAllRestaurant);

    // update hotel restaurant
    this.router.route("/:id").patch(this.Controller.updateHotelRestaurant);
  }
}
export default hotelRestaurantRouter;
