"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const restaurant_hotel_controller_1 = __importDefault(require("../controllers/restaurant.hotel.controller"));
class hotelRestaurantRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new restaurant_hotel_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Restaurant Router ======================//
        // Create and View Restaurant
        this.router
            .route("/")
            .post(this.Controller.createRestaurant)
            .get(this.Controller.getAllRestaurant);
    }
}
exports.default = hotelRestaurantRouter;
//# sourceMappingURL=restaurant.router.js.map