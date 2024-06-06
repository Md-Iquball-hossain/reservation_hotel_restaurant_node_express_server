"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const food_controller_1 = __importDefault(require("../controllers/food.controller"));
class FoodRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new food_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // Food
        this.router
            .route("/")
            .post(this.Controller.createFood)
            .get(this.Controller.getAllFood);
        // pur-item
        this.router.route("/pur-item").get(this.Controller.getAllPurchaseIngItem);
        // Single Food
        this.router
            .route("/:id")
            .get(this.Controller.getSingleFood)
            .patch(this.Controller.updateFood);
    }
}
exports.default = FoodRouter;
//# sourceMappingURL=food.router.js.map