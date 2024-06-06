"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const report_dashBoard_controller_1 = __importDefault(require("../controllers/report.dashBoard.controller"));
const report_account_router_1 = __importDefault(require("./report.account.router"));
const report_client_ledger_router_1 = __importDefault(require("./report.client-ledger.router"));
const report_expense_router_1 = __importDefault(require("./report.expense.router"));
const report_hall_booking_router_1 = __importDefault(require("./report.hall-booking.router"));
const report_room_booking_router_1 = __importDefault(require("./report.room-booking.router"));
const report_room_router_1 = __importDefault(require("./report.room.router"));
const report_salary_router_1 = __importDefault(require("./report.salary.router"));
class ReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.reportController = new report_dashBoard_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // Room Report
        this.router.use("/room", new report_room_router_1.default().router);
        // room-Booking Report
        this.router.use("/room-booking", new report_room_booking_router_1.default().router);
        // hall-Booking Report
        this.router.use("/hall-booking", new report_hall_booking_router_1.default().router);
        // account report
        this.router.use("/account", new report_account_router_1.default().router);
        // expense report
        this.router.use("/expense", new report_expense_router_1.default().router);
        // salary report
        this.router.use("/salary", new report_salary_router_1.default().router);
        // client-ledger report
        this.router.use("/client-ledger", new report_client_ledger_router_1.default().router);
        //  dashboard data
        this.router
            .route("/dashboard")
            .get(this.reportController.getDashboardReport);
        //  Amount dashboard data
        this.router
            .route("/amount-dashboard")
            .get(this.reportController.getAmountReport);
        // Account dashboard data
        this.router
            .route("/account-dashboard")
            .get(this.reportController.getAccountReport);
        // Room dashboard data
        this.router
            .route("/room_dashboard")
            .get(this.reportController.getRoomReport);
    }
}
exports.default = ReportRouter;
//# sourceMappingURL=reports.router.js.map