"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const auth_hotel_admin_controller_1 = __importDefault(require("../controller/auth.hotel-admin.controller"));
class HotelAdminAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.adminAuthController = new auth_hotel_admin_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // login
        this.router.route("/login").post(this.adminAuthController.login);
        // profile
        this.router
            .route("/profile")
            .get(this.authChecker.hotelAdminAuthChecker, this.adminAuthController.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES), this.authChecker.hotelAdminAuthChecker, this.adminAuthController.updateProfile);
        // forget password
        this.router
            .route("/forget-password")
            .post(this.adminAuthController.forgetPassword);
        // change password
        this.router
            .route("/change-password")
            .post(this.authChecker.hotelAdminAuthChecker, this.adminAuthController.changeAdminPassword);
    }
}
exports.default = HotelAdminAuthRouter;
//# sourceMappingURL=auth.hotel-admin.router.js.map