"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const hall_Booking_controller_1 = __importDefault(require("../controllers/hall-Booking.controller"));
class HallBookingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.hallBookingController = new hall_Booking_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // hall booking router
        this.router
            .route("/")
            .post(this.hallBookingController.createHallBooking)
            .get(this.hallBookingController.getAllHallBooking);
        // single Hall booking details
        this.router
            .route("/:id")
            .get(this.hallBookingController.getSingleHallBooking);
        // hall check in router
        this.router
            .route("/hall-check-in")
            .post(this.hallBookingController.insertHallBookingCheckIn)
            .get(this.hallBookingController.getAllHallBookingCheckIn);
        // hall checkout router
        this.router
            .route("/hall-check-out/:id")
            .post(this.hallBookingController.updateBookingCheckOut);
    }
}
exports.default = HallBookingRouter;
//# sourceMappingURL=hall-booking.router.js.map