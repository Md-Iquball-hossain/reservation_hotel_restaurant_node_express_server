"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const setting_employee_router_1 = __importDefault(require("./setting.employee.router"));
const hotel_router_1 = __importDefault(require("./hotel.router"));
const setting_room_router_1 = __importDefault(require("./setting.room.router"));
const setting_department_router_1 = __importDefault(require("./setting.department.router"));
const setting_designation_router_1 = __importDefault(require("./setting.designation.router"));
const setting_hall_router_1 = __importDefault(require("./setting.hall.router"));
const setting_payroll_month_router_1 = __importDefault(require("./setting.payroll-month.router"));
const setting_bankname_router_1 = __importDefault(require("./setting.bankname.router"));
class SettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        // hotel router
        this.router.use("/hotel", new hotel_router_1.default().router);
        // room setting router
        this.router.use("/room", new setting_room_router_1.default().router);
        // bank name router
        this.router.use("/bank-name", new setting_bankname_router_1.default().router);
        // Department setting router
        this.router.use("/department", new setting_department_router_1.default().router);
        // Designation setting router
        this.router.use("/designation", new setting_designation_router_1.default().router);
        // Employee setting router
        this.router.use("/employee", new setting_employee_router_1.default().router);
        // Hall Amenities router
        this.router.use("/hall", new setting_hall_router_1.default().router);
        // Payroll Month router
        this.router.use("/payroll-month", new setting_payroll_month_router_1.default().router);
    }
}
exports.default = SettingRouter;
//# sourceMappingURL=setting.router.js.map