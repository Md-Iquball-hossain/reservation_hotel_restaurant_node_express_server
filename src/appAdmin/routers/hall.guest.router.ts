import AbstractRouter from "../../abstarcts/abstract.router";
import GuestController from "../controllers/guest.controller";

class HallGuestRouter extends AbstractRouter {
    private guestController;

    constructor() {
        super();
        this.guestController = new GuestController();
        this.callRouter();
    }

    private callRouter() {

        // guest
        this.router.route("/")
        .get(this.guestController.getHallGuest);

    }
}
export default HallGuestRouter;