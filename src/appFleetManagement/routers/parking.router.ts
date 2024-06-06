import AbstractRouter from "../../abstarcts/abstract.router";
import ParkingController from "../controllers/parking.controller";

class ParkingRouter extends AbstractRouter {
    private Controller = new ParkingController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

        // create and get all Parking
        this.router
        .route("/")
        .post(this.Controller.createParking)
        .get(this.Controller.getAllParking)

        //assign Parking
        this.router
        .route("/assign-parking")
        .post(this.Controller.createVehicleParking)
        .get(this.Controller.getAllVehicleParking)

        // update Vehicle
        this.router
        .route("/:id")
        .get (this.Controller.getSingleParking)
        .patch(this.Controller.updateParking)

        // update Vehicle parking status
        this.router
        .route("/assign-parking/:id")
        .patch(this.Controller.updateVehicleParking)

    }
}
export default ParkingRouter;