"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const maintenance_controller_1 = __importDefault(require("../controllers/maintenance.controller"));
class MaintenanceRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new maintenance_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all Maintenance
        this.router
            .route("/")
            .post(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.createMaintenance)
            .get(this.Controller.getAllMaintenance);
        // single and update Maintenance
        this.router
            .route("/:id")
            .patch(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.updateMaintenance);
    }
}
exports.default = MaintenanceRouter;
//# sourceMappingURL=maintenance.router.js.map