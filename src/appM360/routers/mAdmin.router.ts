import { Router } from "express";
import MAdministrationRouter from "./mAdmin.administration.router";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import MHotelRouter from "./mHotel.router";
import MConfigurationRouter from "./mConfiguration.router";

class MAdminRouter {
  public mAdminRouter = Router();
  public authChecker = new AuthChecker();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // hotel router
    this.mAdminRouter.use(
      "/hotel",
      this.authChecker.mAdminAuthChecker,
      new MHotelRouter().router
    );

    // configuration
    this.mAdminRouter.use(
      "/configuration",
      this.authChecker.mAdminAuthChecker,
      new MConfigurationRouter().router
    );

    // administration router
    this.mAdminRouter.use(
      "/administration",
      this.authChecker.mAdminAuthChecker,
      new MAdministrationRouter().router
    );
  }
}

export default MAdminRouter;
