"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("./controllers/admin.controller"));
class AdminRouter {
    constructor() {
        this.AdminRouter = (0, express_1.Router)();
        this.adminController = new admin_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get all admin
        this.AdminRouter.route("/").get(this.adminController.getAllAdmin);
    }
}
exports.default = AdminRouter;
//# sourceMappingURL=admin.router.js.map