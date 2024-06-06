import AbstractRouter from "../../abstarcts/abstract.router";
import HallBookingController from "../controllers/hall-Booking.controller";

class HallBookingRouter extends AbstractRouter {
    private hallBookingController;
    constructor() {
    super();
    this.hallBookingController = new HallBookingController();
    this.callRouter();
    }
    private callRouter() {
        // hall booking router
        this.router
        .route("/")
        .post(this.hallBookingController.createHallBooking)
        .get(this.hallBookingController.getAllHallBooking)

        // single Hall booking details
        this.router
        .route("/:id")
        .get(this.hallBookingController.getSingleHallBooking);

        // hall check in router
        this.router
        .route("/hall-check-in")
        .post(this.hallBookingController.insertHallBookingCheckIn)
        .get(this.hallBookingController.getAllHallBookingCheckIn);

        // hall checkout router
        this.router
        .route("/hall-check-out/:id")
        .post(this.hallBookingController.updateBookingCheckOut);

    }

}
export default HallBookingRouter;
