"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const booking_controller_1 = __importDefault(require("../controllers/booking.controller"));
class ClientRoomBookingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.clientRoomBookingController = new booking_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // room booking router
        this.router
            .route("/")
            .post(this.authChecker.hotelUserAuthChecker, this.clientRoomBookingController.createRoomBooking)
            .get(this.authChecker.hotelUserAuthChecker, this.clientRoomBookingController.getAllRoomBooking);
        // single room
        this.router
            .route("/single/:id")
            .get(this.authChecker.hotelUserAuthChecker, this.clientRoomBookingController.getSingleRoomBooking);
    }
}
exports.default = ClientRoomBookingRouter;
//# sourceMappingURL=room-booking.router.js.map