import AbstractRouter from "../../abstarcts/abstract.router";
import GuestController from "../controllers/guest.controller";

class GuestRouter extends AbstractRouter {
  private guestController;

  constructor() {
    super();
    this.guestController = new GuestController();
    this.callRouter();
  }

  private callRouter() {
    // guest
    this.router
      .route("/")
      .post(this.guestController.createGuest)
      .get(this.guestController.getAllGuest);

    // single guest router
    this.router.route("/:user_id").get(this.guestController.getSingleGuest);

    // insert guest ledger
  }
}
export default GuestRouter;
