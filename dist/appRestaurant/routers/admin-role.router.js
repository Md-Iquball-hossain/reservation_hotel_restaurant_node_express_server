"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const admin_role_controller_1 = __importDefault(require("../controllers/admin-role.controller"));
class AdministrationResRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.administratonController = new admin_role_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/admin")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.RESTAURANT_FILES), this.administratonController.createAdmin)
            .get(this.administratonController.getAllAdmin);
        // create permission
        this.router
            .route("/permission")
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
        // Get all employee
        this.router
            .route("/employee")
            .get(this.administratonController.getAllEmployee);
        // update admin
        this.router
            .route("/admin/:id")
            .patch(this.administratonController.updateResAdmin);
    }
}
exports.default = AdministrationResRouter;
//# sourceMappingURL=admin-role.router.js.map