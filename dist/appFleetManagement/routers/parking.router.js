"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const parking_controller_1 = __importDefault(require("../controllers/parking.controller"));
class ParkingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new parking_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all Parking
        this.router
            .route("/")
            .post(this.Controller.createParking)
            .get(this.Controller.getAllParking);
        //assign Parking
        this.router
            .route("/assign-parking")
            .post(this.Controller.createVehicleParking)
            .get(this.Controller.getAllVehicleParking);
        // update Vehicle
        this.router
            .route("/:id")
            .get(this.Controller.getSingleParking)
            .patch(this.Controller.updateParking);
        // update Vehicle parking status
        this.router
            .route("/assign-parking/:id")
            .patch(this.Controller.updateVehicleParking);
    }
}
exports.default = ParkingRouter;
//# sourceMappingURL=parking.router.js.map