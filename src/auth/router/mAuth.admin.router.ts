import AbstractRouter from "../../abstarcts/abstract.router";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import MAdminAuthController from "../controller/mAuth.admin.controller";

class MAdminAuthRouter extends AbstractRouter {
  private mAdminAuthController = new MAdminAuthController();
  private authChecker = new AuthChecker();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // login
    this.router.route("/login").post(this.mAdminAuthController.login);

    // profile
    this.router
      .route("/profile")
      .get(
        this.authChecker.mAdminAuthChecker,
        this.mAdminAuthController.getProfile
      )
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES),
        this.authChecker.mAdminAuthChecker,
        this.mAdminAuthController.updateProfile
      );

    // forget password
    this.router
      .route("/forget-password")
      .post(this.mAdminAuthController.forgetPassword);

    // change password
    this.router
      .route("/change-password")
      .post(
        this.authChecker.mAdminAuthChecker,
        this.mAdminAuthController.changeAdminPassword
      );
  }
}
export default MAdminAuthRouter;
