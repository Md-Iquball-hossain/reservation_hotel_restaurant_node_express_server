"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const hall_Booking_controller_1 = __importDefault(require("../controllers/hall-Booking.controller"));
class HallCheckinRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.hallBookingController = new hall_Booking_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // hall check in router
        this.router
            .route("/")
            .get(this.hallBookingController.getAllHallBookingCheckIn);
    }
}
exports.default = HallCheckinRouter;
//# sourceMappingURL=hall-checkin.router.js.map