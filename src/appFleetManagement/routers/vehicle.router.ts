import AbstractRouter from "../../abstarcts/abstract.router";
import VehiclesController from "../controllers/vehicle.controller";

class VehicleRouter extends AbstractRouter {
    private Controller = new VehiclesController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

        // create and get all Vehicle
        this.router
        .route("/")
        .post(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.createVehicle
        )
        .get(this.Controller.getAllVehicle)

        // single and update Vehicle
        this.router
        .route("/:id")
        .get(this.Controller.getSingleVehicle)
        .patch(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.updateVehicle
        );

    }
}
export default VehicleRouter;