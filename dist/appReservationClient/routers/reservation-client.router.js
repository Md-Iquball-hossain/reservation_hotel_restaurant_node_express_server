"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const room_router_1 = __importDefault(require("./room.router"));
const room_booking_router_1 = __importDefault(require("./room-booking.router"));
const images_router_1 = __importDefault(require("./images.router"));
class ReservationClientRouter {
    constructor() {
        this.hUserRouter = (0, express_1.Router)();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // room router
        this.hUserRouter.use("/room", this.authChecker.webTokenVerfiyChecker, new room_router_1.default().router);
        // room router
        this.hUserRouter.use("/images", this.authChecker.webTokenVerfiyChecker, new images_router_1.default().router);
        // room router
        this.hUserRouter.use("/room-booking", this.authChecker.webTokenVerfiyChecker, new room_booking_router_1.default().router);
    }
}
exports.default = ReservationClientRouter;
//# sourceMappingURL=reservation-client.router.js.map