import AbstractRouter from "../../abstarcts/abstract.router";
import PayRollController from "../controllers/payRoll.controller";

class PayRollRouter extends AbstractRouter {
  private controller = new PayRollController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // create and get all PayRoll
    this.router
      .route("/")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_PAYROLL_FILES),
        this.controller.createPayRoll
      )
      .get(this.controller.getAllPayRoll);

    // update and delete pay roll
    this.router
      .route("/:id")
      .get(this.controller.getSinglePayRoll)
  }
}
export default PayRollRouter;
