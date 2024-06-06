import AbstractRouter from "../../abstarcts/abstract.router";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import AuthHotelUserController from "../controller/auth.hotel-user.controller";

class AuthHotelUserRouter extends AbstractRouter {
  private authHotelUserController = new AuthHotelUserController();
  private authChecker = new AuthChecker();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // registration
    this.router
      .route("/registration")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_USER_FILES),
        this.authHotelUserController.registration
      );

    // login
    this.router.route("/login").
    post(this.authHotelUserController.login);

    // profile
    this.router
      .route("/profile")
      .get(
        this.authChecker.hotelUserAuthChecker,
        this.authHotelUserController.getProfile
      )
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_USER_FILES),
        this.authChecker.hotelUserAuthChecker,
        this.authHotelUserController.updateProfile
      );

    // forget password
    this.router
      .route("/forget-password")
      .post(this.authHotelUserController.forgetPassword);

    // change password
    this.router
      .route("/change-password")
      .post(
        this.authChecker.hotelUserAuthChecker,
        this.authHotelUserController.changePassword
      );
  }
}
export default AuthHotelUserRouter;
