"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const restaurant_controller_1 = __importDefault(require("../controllers/restaurant.controller"));
class RestaurantProfileRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new restaurant_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Restaurant Router ======================//
        // update Restaurant
        this.router.
            route("/")
            .patch(this.Controller.updateRestaurant);
    }
}
exports.default = RestaurantProfileRouter;
//# sourceMappingURL=restaurant.router.js.map