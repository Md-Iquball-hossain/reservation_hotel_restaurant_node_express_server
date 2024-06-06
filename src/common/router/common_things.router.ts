import CommonAbstractRouter from "../commonAbstract/common.abstract.router";
import CommonThingsController from "../controllers/common_things.controller";

class CommonThingsRouter extends CommonAbstractRouter {
  private CommonController = new CommonThingsController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    // create module
    this.router
      .route("/restaurant/permission-group")
      .get(this.CommonController.getRestaurantPermissionGroup);
  }
}

export default CommonThingsRouter;
