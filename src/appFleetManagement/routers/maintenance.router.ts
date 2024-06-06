import AbstractRouter from "../../abstarcts/abstract.router";
import MaintenanceController from "../controllers/maintenance.controller";

class MaintenanceRouter extends AbstractRouter {
    private Controller = new MaintenanceController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

        // create and get all Maintenance
        this.router
        .route("/")
        .post(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.createMaintenance
        )
        .get(this.Controller.getAllMaintenance)

        // single and update Maintenance
        this.router
        .route("/:id")
        .patch(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.updateMaintenance
        );

    }
}
export default MaintenanceRouter;