"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const administration_controller_1 = __importDefault(require("../controllers/administration.controller"));
class AdministrationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.radministratonController = new administration_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/admin")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_ADMIN_FILES), this.radministratonController.createAdmin)
            .get(this.radministratonController.getAllAdmin);
        // create module
        this.router
            .route("/permission-group")
            .post(this.radministratonController.createPermissionGroup)
            .get(this.radministratonController.getPermissionGroup);
        // create permission
        this.router
            .route("/permission")
            .post(this.radministratonController.createPermission)
            .get(this.radministratonController.getAllPermission);
        // create role
        this.router
            .route("/role")
            .post(this.radministratonController.createRole)
            .get(this.radministratonController.getRole);
        // get single role
        this.router
            .route("/role/:id")
            .get(this.radministratonController.getSingleRole)
            .patch(this.radministratonController.updateSingleRole);
        // get admins role permission
        this.router
            .route("/admin-role-permission")
            .get(this.radministratonController.getAdminRole);
    }
}
exports.default = AdministrationRouter;
//# sourceMappingURL=rAdmin.administration.router.js.map