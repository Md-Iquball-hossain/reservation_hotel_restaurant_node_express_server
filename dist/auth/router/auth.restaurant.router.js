"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const auth_rest_user_controller_1 = __importDefault(require("../controller/auth.rest-user.controller"));
class RestaurantProfileRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new auth_rest_user_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Restaurant Router ======================//
        // login Restaurant
        this.router.
            route("/login").
            post(this.Controller.loginRestaurant);
    }
}
exports.default = RestaurantProfileRouter;
//# sourceMappingURL=auth.restaurant.router.js.map