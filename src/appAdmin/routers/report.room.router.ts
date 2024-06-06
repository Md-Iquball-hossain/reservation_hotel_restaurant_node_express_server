import AbstractRouter from "../../abstarcts/abstract.router";
import RoomReportController from "../controllers/report.room.controller";

class RoomReportRouter extends AbstractRouter {
    private roomReportController;
    constructor() {
        super();
        this.roomReportController = new RoomReportController();
        this.callRouter();
}
    private callRouter() {

    // get room report router
    this.router.route("/").get(this.roomReportController.getRoomReport);

    }

}
export default RoomReportRouter;
