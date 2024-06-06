"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const auth_hotel_user_controller_1 = __importDefault(require("../controller/auth.hotel-user.controller"));
class AuthHotelUserRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.authHotelUserController = new auth_hotel_user_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // registration
        this.router
            .route("/registration")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_USER_FILES), this.authHotelUserController.registration);
        // login
        this.router.route("/login").
            post(this.authHotelUserController.login);
        // profile
        this.router
            .route("/profile")
            .get(this.authChecker.hotelUserAuthChecker, this.authHotelUserController.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_USER_FILES), this.authChecker.hotelUserAuthChecker, this.authHotelUserController.updateProfile);
        // forget password
        this.router
            .route("/forget-password")
            .post(this.authHotelUserController.forgetPassword);
        // change password
        this.router
            .route("/change-password")
            .post(this.authChecker.hotelUserAuthChecker, this.authHotelUserController.changePassword);
    }
}
exports.default = AuthHotelUserRouter;
//# sourceMappingURL=auth.hotel-user.router.js.map