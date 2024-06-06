import AbstractRouter from "../../abstarcts/abstract.router";
import TripController from "../controllers/trip.controller";

class TripRouter extends AbstractRouter {
    private Controller = new TripController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

        // create and get Trip
        this.router
        .route("/")
        .post(
        this.uploader
        .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.createTrip
        )
        .get(this.Controller.getAllTrip)

    }
}
export default TripRouter;