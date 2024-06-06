"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authChecker_1 = __importDefault(require("../common/middleware/authChecker/authChecker"));
const auth_hotel_admin_router_1 = __importDefault(require("./router/auth.hotel-admin.router"));
const auth_hotel_user_router_1 = __importDefault(require("./router/auth.hotel-user.router"));
const auth_rest_user_router_1 = __importDefault(require("./router/auth.rest-user.router"));
const mAuth_admin_router_1 = __importDefault(require("./router/mAuth.admin.router"));
const express_1 = require("express");
class AuthRouter {
    constructor() {
        this.AuthRouter = (0, express_1.Router)();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // user auth for hotel
        this.AuthRouter.use("/hotel-user", this.authChecker.webTokenVerfiyChecker, new auth_hotel_user_router_1.default().router);
        // admin auth for hotel
        this.AuthRouter.use("/hotel-admin", new auth_hotel_admin_router_1.default().router);
        // ================== restaurant panel auth ================== //
        this.AuthRouter.use("/restaurant", new auth_rest_user_router_1.default().router);
        // ================== m360ict admin panel auth ================== //
        this.AuthRouter.use("/m-admin", new mAuth_admin_router_1.default().router);
    }
}
exports.default = AuthRouter;
//# sourceMappingURL=auth.router.js.map