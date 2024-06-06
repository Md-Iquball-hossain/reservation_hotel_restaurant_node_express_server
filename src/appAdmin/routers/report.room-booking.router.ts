import AbstractRouter from "../../abstarcts/abstract.router";
import RoomBookingReportController from "../controllers/report.room-booking.controller";


class RoomBookingReportRouter extends AbstractRouter {
    private roomBookingReportController;
    constructor() {
        super();
        this.roomBookingReportController = new RoomBookingReportController();
        this.callRouter();
}
    private callRouter() {

    // get room Booking report router
    this.router.route("/")
    .get(this.roomBookingReportController.getRoomBookingReport);

    }
}
export default RoomBookingReportRouter;