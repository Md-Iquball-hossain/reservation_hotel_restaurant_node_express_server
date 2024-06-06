"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const room_booking_controller_1 = __importDefault(require("../controllers/room-booking.controller"));
class RoomBookingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.roomBookingController = new room_booking_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // room booking router
        this.router
            .route("/")
            .post(this.roomBookingController.createRoomBooking)
            .get(this.roomBookingController.getAllRoomBooking);
        // check in router
        this.router
            .route("/check-in")
            .post(this.roomBookingController.insertBookingCheckIn)
            .get(this.roomBookingController.getAllRoomBookingCheckIn);
        // checkout router
        this.router
            .route("/check-out/:id")
            .post(this.roomBookingController.addBookingCheckOut);
        // extend room booking
        this.router
            .route("/extend/:id")
            .patch(this.roomBookingController.extendRoomBooking);
        // refund room booking
        this.router
            .route("/refund/:id")
            .patch(this.roomBookingController.refundRoomBooking);
        // single room booking
        this.router
            .route("/:id")
            .get(this.roomBookingController.getSingleRoomBooking);
    }
}
exports.default = RoomBookingRouter;
//# sourceMappingURL=room-booking.router.js.map