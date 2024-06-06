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
exports.ExpenseReportService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class ExpenseReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get all Expense Report service
    getExpenseReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { from_date, to_date, limit, skip, key } = req.query;
            const model = this.Model.reportModel();
            const { data, total, totalAmount } = yield model.getExpenseReport({
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                key: key,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                totalAmount,
                total,
                data,
            };
        });
    }
}
exports.ExpenseReportService = ExpenseReportService;
exports.default = ExpenseReportService;
//# sourceMappingURL=expenseReport.service.js.map