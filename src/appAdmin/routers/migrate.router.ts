import AbstractRouter from "../../abstarcts/abstract.router";
import MigrateController from "../controllers/migrate.controller";

class MigrateRouter extends AbstractRouter {
  private controller = new MigrateController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // migate room booking invoice items
    this.router
      .route("/invoice-items")
      .post(this.controller.roomBookingInvoiceItems);

    // migate room booking invoice items
    this.router
    .route("/invoice-hall-items")
    .post(this.controller.hallBookingInvoiceItems);

  }
}
export default MigrateRouter;
