import AbstractRouter from "../../abstarcts/abstract.router";
import DriverController from "../controllers/driver.controller";

class DriverRouter extends AbstractRouter {
    private Controller = new DriverController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

        // create and get all driver
        this.router
        .route("/")
        .post(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.createDriver
        )
        .get(this.Controller.getAllDriver)

        // single and update driver
        this.router
        .route("/:id")
        .get(this.Controller.getSingleDriver)
        .patch(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.updateDriver
        );

    }
}
export default DriverRouter;