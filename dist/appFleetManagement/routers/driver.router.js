"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const driver_controller_1 = __importDefault(require("../controllers/driver.controller"));
class DriverRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new driver_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all driver
        this.router
            .route("/")
            .post(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.createDriver)
            .get(this.Controller.getAllDriver);
        // single and update driver
        this.router
            .route("/:id")
            .get(this.Controller.getSingleDriver)
            .patch(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.updateDriver);
    }
}
exports.default = DriverRouter;
//# sourceMappingURL=driver.router.js.map