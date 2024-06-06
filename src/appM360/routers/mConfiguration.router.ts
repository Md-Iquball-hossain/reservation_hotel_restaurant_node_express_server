import AbstractRouter from "../../abstarcts/abstract.router";
import MConfigurationController from "../controllers/mConfiguration.controller";

class MConfigurationRouter extends AbstractRouter {
  public controller;

  constructor() {
    super();
    this.controller = new MConfigurationController();
    this.callRouter();
  }
  private callRouter() {
    // create module
    this.router
      .route("/permission-group")
      .post(this.controller.createPermissionGroup)
      .get(this.controller.getPermissionGroup);

    // get all permission by hotel
    this.router
      .route("/permission/by-hotel/:id")
      .get(this.controller.getSingleHotelPermission)
      .patch(this.controller.updateSingleHotelPermission);

    // create permission
    this.router
      .route("/permission")
      .post(this.controller.createPermission)
      .get(this.controller.getAllPermission);
  }
}

export default MConfigurationRouter;
