import CommonAbstractRouter from "../commonAbstract/common.abstract.router";
import CommonController from "../controllers/common.controller";

class CommonRouter extends CommonAbstractRouter {
  private CommonController = new CommonController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    // send Email otp
    this.router.post(
      "/send-email-otp",
      this.CommonController.sendEmailOtpController
    );

    // match email otp
    this.router.post(
      "/match-email-otp",
      this.CommonController.matchEmailOtpController
    );
  }
}

export default CommonRouter;
