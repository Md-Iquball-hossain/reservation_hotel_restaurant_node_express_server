"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const trip_controller_1 = __importDefault(require("../controllers/trip.controller"));
class TripRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new trip_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get Trip
        this.router
            .route("/")
            .post(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.createTrip)
            .get(this.Controller.getAllTrip);
    }
}
exports.default = TripRouter;
//# sourceMappingURL=trip.router.js.map