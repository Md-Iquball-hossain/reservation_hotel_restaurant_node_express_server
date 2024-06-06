import AbstractRouter from "../../abstarcts/abstract.router";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import RestaurantAuthController from "../controller/auth.rest-user.controller";

class RestaurantProfileRouter extends AbstractRouter {
  private Controller = new RestaurantAuthController();
  private authChecker = new AuthChecker();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // login Restaurant
    this.router.route("/login").post(this.Controller.loginRestaurant);

    // forget password
    this.router.route("/forget-password").post(this.Controller.forgetPassword);

    // change password
    this.router
      .route("/change-password")
      .post(
        this.authChecker.hotelRestAuthChecker,
        this.Controller.changeAdminPassword
      );
  }
}
export default RestaurantProfileRouter;
