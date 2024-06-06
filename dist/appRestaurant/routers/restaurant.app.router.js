"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const ingredient_router_1 = __importDefault(require("./ingredient.router"));
const supplier_router_1 = __importDefault(require("./supplier.router"));
const category_router_1 = __importDefault(require("./category.router"));
const purchase_router_1 = __importDefault(require("./purchase.router"));
const restaurant_profile_router_1 = __importDefault(require("./restaurant.profile.router"));
const account_router_1 = __importDefault(require("./account.router"));
const food_router_1 = __importDefault(require("./food.router"));
const inventory_router_1 = __importDefault(require("./inventory.router"));
const expense_router_1 = __importDefault(require("./expense.router"));
const order_router_1 = __importDefault(require("./order.router"));
const invoice_router_1 = __importDefault(require("./invoice.router"));
const report_router_1 = __importDefault(require("./report.router"));
const admin_role_router_1 = __importDefault(require("./admin-role.router"));
class RestaurantRouter {
    constructor() {
        this.restaurantRouter = (0, express_1.Router)();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // Restaurant Profile router
        this.restaurantRouter.use("/profile", this.authChecker.hotelRestAuthChecker, new restaurant_profile_router_1.default().router);
        // ingredient router
        this.restaurantRouter.use("/ingredient", this.authChecker.hotelRestAuthChecker, new ingredient_router_1.default().router);
        // Supplier router
        this.restaurantRouter.use("/supplier", this.authChecker.hotelRestAuthChecker, new supplier_router_1.default().router);
        // Category router
        this.restaurantRouter.use("/category", this.authChecker.hotelRestAuthChecker, new category_router_1.default().router);
        // Purchase router
        this.restaurantRouter.use("/purchase", this.authChecker.hotelRestAuthChecker, new purchase_router_1.default().router);
        // Account router
        this.restaurantRouter.use("/account", this.authChecker.hotelRestAuthChecker, new account_router_1.default().router);
        // Food router
        this.restaurantRouter.use("/food", this.authChecker.hotelRestAuthChecker, new food_router_1.default().router);
        // inventory router
        this.restaurantRouter.use("/inventory", this.authChecker.hotelRestAuthChecker, new inventory_router_1.default().router);
        // expense router
        this.restaurantRouter.use("/expense", this.authChecker.hotelRestAuthChecker, new expense_router_1.default().router);
        // order router
        this.restaurantRouter.use("/order", this.authChecker.hotelRestAuthChecker, new order_router_1.default().router);
        // invoice router
        this.restaurantRouter.use("/invoice", this.authChecker.hotelRestAuthChecker, new invoice_router_1.default().router);
        // invoice router
        this.restaurantRouter.use("/report", this.authChecker.hotelRestAuthChecker, new report_router_1.default().router);
        // administration router
        this.restaurantRouter.use("/administration", this.authChecker.hotelRestAuthChecker, new admin_role_router_1.default().router);
    }
}
exports.default = RestaurantRouter;
//# sourceMappingURL=restaurant.app.router.js.map