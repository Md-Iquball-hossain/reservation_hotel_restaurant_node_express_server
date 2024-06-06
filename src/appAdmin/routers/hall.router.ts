import AbstractRouter from "../../abstarcts/abstract.router";
import HallController from "../controllers/hall.controller";

class HallRouter extends AbstractRouter {
    private hallController;
    constructor() {
        super();
        this.hallController = new HallController();
        this.callRouter();
    }
    private callRouter() {
    // create and view hall list
    this.router
        .route("/")
        .post(
            this.uploader.cloudUploadRaw(this.fileFolders.HALL_FILES),
            this.hallController.createHall)
        .get(this.hallController.getAllHall)

    // get all available and unavailable hall
    this.router
        .route("/available-unavailable")
        .get(this.hallController.getAllAvailableAndUnavailableHall);

    // get all available room
    this.router
        .route("/available")
        .get(this.hallController.getAllAvailableHall);

    // Single hall view and edit
    this.router.route("/:hall_id")
        .get(this.hallController.getSingleHall)
        .patch(
            this.uploader.cloudUploadRaw(this.fileFolders.HALL_FILES),
            this.hallController.updateHall
        );

    }
}
export default HallRouter;