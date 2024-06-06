"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const ingredient_controller_1 = __importDefault(require("../controllers/ingredient.controller"));
class IngredientRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new ingredient_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Ingredient Router ======================//
        // Ingredient
        this.router
            .route("/")
            .post(this.Controller.createIngredient)
            .get(this.Controller.getAllIngredient);
        // edit and remove Ingredient
        this.router
            .route("/:id")
            .patch(this.Controller.updateIngredient)
            .delete(this.Controller.deleteIngredient);
    }
}
exports.default = IngredientRouter;
//# sourceMappingURL=ingredient.router.js.map