import AbstractRouter from "../../abstarcts/abstract.router";
import FuelController from "../controllers/fuel.controller";

class FuelRouter extends AbstractRouter {
    private Controller = new FuelController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

        // create and get all fuel
        this.router
        .route("/")
        .post(
        this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES),
        this.Controller.createFuelRefill
        )
        .get(this.Controller.getAllFuelRefill)

    }
}
export default FuelRouter;