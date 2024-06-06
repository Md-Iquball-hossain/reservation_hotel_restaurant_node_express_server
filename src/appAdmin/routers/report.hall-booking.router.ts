import AbstractRouter from "../../abstarcts/abstract.router";
import HallBookingReportController from "../controllers/report.hall-booking.controller";

class HallBookingReportRouter extends AbstractRouter {
    private hallBookingReportController;
    constructor() {
        super();
        this.hallBookingReportController = new HallBookingReportController();
        this.callRouter();
}
    private callRouter() {

    // get hall Booking report router
    this.router.route("/")
    .get(this.hallBookingReportController.getHallBookingReport);

    }
}
export default HallBookingReportRouter;