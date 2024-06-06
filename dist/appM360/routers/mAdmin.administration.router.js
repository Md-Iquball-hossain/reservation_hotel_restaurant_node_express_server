"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const mAdmin_administration_controller_1 = __importDefault(require("../controllers/mAdmin.administration.controller"));
class MAdministrationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.administratonController = new mAdmin_administration_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/admin")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES), this.administratonController.createAdmin)
            .get(this.administratonController.getAllAdmin);
        // create module
        this.router
            .route("/permission-group")
            .post(this.administratonController.createPermissionGroup)
            .get(this.administratonController.getPermissionGroup);
        // create permission
        this.router
            .route("/permission")
            .post(this.administratonController.createPermission)
            .get(this.administratonController.getAllPermission);
        // create role
        this.router
            .route("/role")
            .post(this.administratonController.createRole)
            .get(this.administratonController.getRole);
        // get single role
        this.router
            .route("/role/:id")
            .get(this.administratonController.getSingleRole)
            .patch(this.administratonController.updateSingleRole);
        // get admins role permission
        this.router
            .route("/admin-role-permission")
            .get(this.administratonController.getAdminRole);
        // ======================= restaurant ======================//
        // create module
        this.router
            .route("/restaurant/permission-group")
            .post(this.administratonController.createRestaurantPermissionGroup)
            .get(this.administratonController.getRestaurantPermissionGroup);
    }
}
exports.default = MAdministrationRouter;
//# sourceMappingURL=mAdmin.administration.router.js.map