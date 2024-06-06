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
        this.router.route("/").get(this.Controller.getSingleRestaurant);
        // update Restaurant
        this.router
            .route("/")
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.RESTAURANT_FILES), this.Controller.updateRestaurant);
        // update Restaurant admin
        this.router
            .route("/admin/:id")
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.RESTAURANT_FILES), this.Controller.updateResAdmin);
    }
}
exports.default = RestaurantProfileRouter;
//# sourceMappingURL=restaurant.profile.router.js.map