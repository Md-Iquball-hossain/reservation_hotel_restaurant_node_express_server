"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mAdmin_administration_router_1 = __importDefault(require("./mAdmin.administration.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const mUser_router_1 = __importDefault(require("./mUser.router"));
class MAdminRouter {
    constructor() {
        this.mAdminRouter = (0, express_1.Router)();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // user router
        this.mAdminRouter.use("/user", this.authChecker.mAdminAuthChecker, new mUser_router_1.default().router);
        // administration router
        this.mAdminRouter.use("/administration", this.authChecker.mAdminAuthChecker, new mAdmin_administration_router_1.default().router);
    }
}
exports.default = MAdminRouter;
//# sourceMappingURL=mAdminRouter.js.map