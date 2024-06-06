"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const mAuth_admin_controller_1 = __importDefault(require("../controller/mAuth.admin.controller"));
class MAdminAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.mAdminAuthController = new mAuth_admin_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // login
        this.router.route("/login").post(this.mAdminAuthController.login);
        // profile
        this.router
            .route("/profile")
            .get(this.authChecker.mAdminAuthChecker, this.mAdminAuthController.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES), this.authChecker.mAdminAuthChecker, this.mAdminAuthController.updateProfile);
        // forget password
        this.router
            .route("/forget-password")
            .post(this.mAdminAuthController.forgetPassword);
        // change password
        this.router
            .route("/change-password")
            .post(this.authChecker.mAdminAuthChecker, this.mAdminAuthController.changeAdminPassword);
    }
}
exports.default = MAdminAuthRouter;
//# sourceMappingURL=mAuth.admin.router.js.map