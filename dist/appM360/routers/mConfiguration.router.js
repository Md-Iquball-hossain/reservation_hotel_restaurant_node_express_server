"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const mConfiguration_controller_1 = __importDefault(require("../controllers/mConfiguration.controller"));
class MConfigurationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new mConfiguration_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create module
        this.router
            .route("/permission-group")
            .post(this.controller.createPermissionGroup)
            .get(this.controller.getPermissionGroup);
        // get all permission by hotel
        this.router
            .route("/permission/by-hotel/:id")
            .get(this.controller.getSingleHotelPermission)
            .patch(this.controller.updateSingleHotelPermission);
        // create permission
        this.router
            .route("/permission")
            .post(this.controller.createPermission)
            .get(this.controller.getAllPermission);
    }
}
exports.default = MConfigurationRouter;
//# sourceMappingURL=mConfiguration.router.js.map