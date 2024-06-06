"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const administration_validator_1 = __importDefault(require("../../utils/validator/admin/administration.validator"));
const admin_administration_controller_1 = __importDefault(require("../controllers/admin.administration.controller"));
class AdministrationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.administratonController = new admin_administration_controller_1.default();
        this.administrationValidator = new administration_validator_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/admin")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_AVATARS), this.administrationValidator.createAdminValidator(), this.administratonController.createAdmin)
            .get(this.administratonController.getAllAdmin);
        // create role permission group
        this.router
            .route("/permission-group")
            .post(this.administrationValidator.createPermissionGroupValidator(), this.administratonController.createPermissionGroup)
            .get(this.administratonController.getPermissionGroup);
        // create permission
        this.router
            .route("/permission")
            .post(this.administrationValidator.createPermissionValidator(), this.administratonController.createPermission)
            .get(this.administratonController.getAllPermission);
        // create role
        this.router
            .route("/role")
            .post(this.administrationValidator.createRoleValidator(), this.administratonController.createRole)
            .get(this.administratonController.getRole);
        // get single role
        this.router
            .route("/role/:id")
            .get(this.commonValidator.commonSingleParamsIdInputValidator(), this.administratonController.getSingleRole)
            .patch(this.administratonController.updateSingleRole);
        // get admins role permission
        this.router
            .route("/admin-role-permission")
            .get(this.administratonController.getAdminRole);
    }
}
exports.default = AdministrationRouter;
//# sourceMappingURL=admin.administration.router.js.map