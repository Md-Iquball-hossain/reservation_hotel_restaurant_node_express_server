"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class ReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getDashboardData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const data = yield this.db.raw(`CALL ${this.schema.RESERVATION_SCHEMA}.dashboard_data(?)`, [hotel_id]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0][0][0],
            };
        });
    }
    getAmountReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date } = req.query;
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.reportModel();
            const Dmodel = this.Model.dashBoardModel();
            // Fetch room booking report
            const roomBookingReport = yield Dmodel.getRoomBookingReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            // Fetch expense report
            const expenseReport = yield model.getExpenseReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            // Fetch salary report
            const salaryReport = yield model.getSalaryReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            // Fetch hall booking report
            const hallBookingReport = yield Dmodel.getHallBookingReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            // Fetch hall booking report
            const dueInvoiceReport = yield Dmodel.getAllInvoice({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            // Calculate total amount for each report type
            const roomBookingAmount = parseFloat(roomBookingReport.totalBookingAmount) || 0;
            const hallBookingAmount = parseFloat(hallBookingReport.totalAmount) || 0;
            const totalDueAmount = parseFloat(dueInvoiceReport.totalAmount) || 0;
            const totalExpense = parseFloat(expenseReport.totalAmount) || 0;
            const SalaryExpense = parseFloat(salaryReport.totalAmount) || 0;
            const total_approved_room_booking = roomBookingReport.total_approved_room_booking || 0;
            const total_pending_room_booking = roomBookingReport.total_pending_room_booking || 0;
            const total_rejected_room_booking = roomBookingReport.total_rejected_room_booking || 0;
            const total_confimed_hall_booking = hallBookingReport.total_confimed_hall || 0;
            const total_canceled_hall_booking = hallBookingReport.total_canceled_hall || 0;
            const total_pending_hall_booking = hallBookingReport.total_pending_hall || 0;
            // Calculate available amount
            const availableAmount = roomBookingAmount +
                hallBookingAmount -
                totalDueAmount -
                totalExpense -
                SalaryExpense;
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: {
                    roomBookingAmount,
                    hallBookingAmount,
                    totalDueAmount,
                    totalExpense,
                    SalaryExpense,
                    availableAmount,
                    total_approved_room_booking,
                    total_pending_room_booking,
                    total_rejected_room_booking,
                    total_confimed_hall_booking,
                    total_pending_hall_booking,
                    total_canceled_hall_booking,
                },
            };
        });
    }
    // Dashboard Acount Report
    getAccountReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, ac_type } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.dashBoardModel();
            const { total, totalDebitAmount, totalCreditAmount } = yield model.getAccountReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
                ac_type: ac_type,
            });
            const totalRemainingAmount = totalCreditAmount - totalDebitAmount;
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                totalDebitAmount,
                totalCreditAmount,
                totalRemainingAmount,
            };
        });
    }
    // Dashboard room Report
    getRoomReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, ac_type } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.dashBoardModel();
            const { total_room, total_super_deluxe_room, total_deluxe_room, total_double_room, total_single_room, } = yield model.getRoomReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            const others_room = Number(total_room) -
                (Number(total_super_deluxe_room) +
                    Number(total_deluxe_room) +
                    Number(total_double_room) +
                    Number(total_single_room));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: {
                    total_room,
                    total_super_deluxe_room,
                    total_deluxe_room,
                    total_double_room,
                    total_single_room,
                    others_room,
                },
            };
        });
    }
}
exports.default = ReportService;
//# sourceMappingURL=report.dashBoard.service.js.map