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
            // Fetch room booking report
            const roomBookingReport = yield model.getRoomBookingReport({
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
            const hallBookingReport = yield model.getHallBookingReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
            });
            // Calculate total amount for each report type
            const roomBookingAmount = parseFloat(roomBookingReport.totalAmount) || 0;
            const hallBookingAmount = parseFloat(hallBookingReport.totalAmount) || 0;
            const totalExpense = parseFloat(expenseReport.totalAmount) || 0;
            const SalaryExpense = parseFloat(salaryReport.totalAmount) || 0;
            // Calculate available amount
            const availableAmount = roomBookingAmount + hallBookingAmount - totalExpense - SalaryExpense;
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: {
                    roomBookingAmount,
                    hallBookingAmount,
                    totalExpense,
                    SalaryExpense,
                    availableAmount
                }
            };
        });
    }
}
exports.default = ReportService;
//# sourceMappingURL=report.service.js.map