import AbstractRouter from "../../abstarcts/abstract.router";
import HallBookingController from "../controllers/hall-Booking.controller";

class HallCheckinRouter extends AbstractRouter {
    private hallBookingController;
    constructor() {
    super();
    this.hallBookingController = new HallBookingController();
    this.callRouter();
    }
    private callRouter() {

        // hall check in router
        this.router
        .route("/")
        .get(this.hallBookingController.getAllHallBookingCheckIn);

    }

}
export default HallCheckinRouter;