"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const setting_router_1 = __importDefault(require("./setting.router"));
const room_booking_router_1 = __importDefault(require("./room-booking.router"));
const room_router_1 = __importDefault(require("./room.router"));
const money_reciept_router_1 = __importDefault(require("./money-reciept.router"));
const reports_router_1 = __importDefault(require("./reports.router"));
const account_router_1 = __importDefault(require("./account.router"));
const administration_router_1 = __importDefault(require("./administration.router"));
const invoice_router_1 = __importDefault(require("./invoice.router"));
const guest_router_1 = __importDefault(require("./guest.router"));
const expense_router_1 = __importDefault(require("./expense.router"));
const payRoll_router_1 = __importDefault(require("./payRoll.router"));
const hall_router_1 = __importDefault(require("./hall.router"));
const hall_booking_router_1 = __importDefault(require("./hall-booking.router"));
const hall_guest_router_1 = __importDefault(require("./hall.guest.router"));
const hall_checkin_router_1 = __importDefault(require("./hall-checkin.router"));
const room_guest_router_1 = __importDefault(require("./room.guest.router"));
const migrate_router_1 = __importDefault(require("./migrate.router"));
const restaurant_hotel_router_1 = __importDefault(require("./restaurant.hotel.router"));
const fleet_router_1 = __importDefault(require("../../appFleetManagement/routers/fleet.router"));
class HotelAdminRouter {
    constructor() {
        this.hAdminRouter = (0, express_1.Router)();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // room booking router
        this.hAdminRouter.use("/room-booking", this.authChecker.hotelAdminAuthChecker, new room_booking_router_1.default().router);
        // setting router
        this.hAdminRouter.use("/setting", this.authChecker.hotelAdminAuthChecker, new setting_router_1.default().router);
        // room router
        this.hAdminRouter.use("/room", this.authChecker.hotelAdminAuthChecker, new room_router_1.default().router);
        // Hall router
        this.hAdminRouter.use("/hall", this.authChecker.hotelAdminAuthChecker, new hall_router_1.default().router);
        // Hall booking router
        this.hAdminRouter.use("/hall-booking", this.authChecker.hotelAdminAuthChecker, new hall_booking_router_1.default().router);
        // Hall Check in router
        this.hAdminRouter.use("/hall-check-in", this.authChecker.hotelAdminAuthChecker, new hall_checkin_router_1.default().router);
        // Report router
        this.hAdminRouter.use("/report", this.authChecker.hotelAdminAuthChecker, new reports_router_1.default().router);
        // administration router
        this.hAdminRouter.use("/administration", this.authChecker.hotelAdminAuthChecker, new administration_router_1.default().router);
        // money reciept router
        this.hAdminRouter.use("/money-reciept", this.authChecker.hotelAdminAuthChecker, new money_reciept_router_1.default().router);
        // account router
        this.hAdminRouter.use("/account", this.authChecker.hotelAdminAuthChecker, new account_router_1.default().router);
        // account router
        this.hAdminRouter.use("/invoice", this.authChecker.hotelAdminAuthChecker, new invoice_router_1.default().router);
        // Expense router
        this.hAdminRouter.use("/expense", this.authChecker.hotelAdminAuthChecker, new expense_router_1.default().router);
        // Guest router
        this.hAdminRouter.use("/guest", this.authChecker.hotelAdminAuthChecker, new guest_router_1.default().router);
        // hall Booking Guest
        this.hAdminRouter.use("/hall-guest", this.authChecker.hotelAdminAuthChecker, new hall_guest_router_1.default().router);
        // room Booking Guest
        this.hAdminRouter.use("/room-guest", this.authChecker.hotelAdminAuthChecker, new room_guest_router_1.default().router);
        // Guest router
        this.hAdminRouter.use("/payroll", this.authChecker.hotelAdminAuthChecker, new payRoll_router_1.default().router);
        // restaurant router
        this.hAdminRouter.use("/restaurant", this.authChecker.hotelAdminAuthChecker, new restaurant_hotel_router_1.default().router);
        // fleet router
        this.hAdminRouter.use("/fleet", this.authChecker.hotelAdminAuthChecker, new fleet_router_1.default().router);
        // data migrate router
        this.hAdminRouter.use("/migrate", this.authChecker.hotelAdminAuthChecker, new migrate_router_1.default().router);
    }
}
exports.default = HotelAdminRouter;
//# sourceMappingURL=hotelAdmin.router.js.map