"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const auth_rest_user_controller_1 = __importDefault(require("../controller/auth.rest-user.controller"));
class RestaurantProfileRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new auth_rest_user_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // login Restaurant
        this.router.route("/login").post(this.Controller.loginRestaurant);
        // forget password
        this.router.route("/forget-password").post(this.Controller.forgetPassword);
        // change password
        this.router
            .route("/change-password")
            .post(this.authChecker.hotelRestAuthChecker, this.Controller.changeAdminPassword);
    }
}
exports.default = RestaurantProfileRouter;
//# sourceMappingURL=auth.rest-user.router.js.map