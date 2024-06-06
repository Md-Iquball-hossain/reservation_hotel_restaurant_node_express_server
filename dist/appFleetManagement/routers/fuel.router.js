"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const fuel_controller_1 = __importDefault(require("../controllers/fuel.controller"));
class FuelRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new fuel_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all fuel
        this.router
            .route("/")
            .post(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.createFuelRefill)
            .get(this.Controller.getAllFuelRefill);
    }
}
exports.default = FuelRouter;
//# sourceMappingURL=fuel.router.js.map