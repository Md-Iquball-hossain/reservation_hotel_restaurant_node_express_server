"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const room_router_1 = __importDefault(require("./room.router"));
class RAdminRouter {
    constructor() {
        this.rAdminRouter = (0, express_1.Router)();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // create room router
        this.rAdminRouter.use("/room", this.authChecker.mAdminAuthChecker, new room_router_1.default().router);
    }
}
exports.default = RAdminRouter;
//# sourceMappingURL=admin.router.js.map