"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
class CategoryRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new category_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Category Router ======================//
        // Category
        this.router
            .route("/")
            .post(this.Controller.createCategory)
            .get(this.Controller.getAllCategory);
        // edit and remove Category
        this.router
            .route("/:id")
            .patch(this.Controller.updateCategory)
            .delete(this.Controller.deleteCategory);
    }
}
exports.default = CategoryRouter;
//# sourceMappingURL=category.router.js.map