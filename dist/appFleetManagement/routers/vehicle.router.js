"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const vehicle_controller_1 = __importDefault(require("../controllers/vehicle.controller"));
class VehicleRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new vehicle_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all Vehicle
        this.router
            .route("/")
            .post(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.createVehicle)
            .get(this.Controller.getAllVehicle);
        // single and update Vehicle
        this.router
            .route("/:id")
            .get(this.Controller.getSingleVehicle)
            .patch(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.updateVehicle);
    }
}
exports.default = VehicleRouter;
//# sourceMappingURL=vehicle.router.js.map