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
exports.AccountReportService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class AccountReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get account report
    getAccountReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, name, limit, skip } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.reportModel();
            const { data, total, totalDebitAmount, totalCreditAmount } = yield model.getAccountReport({
                from_date: from_date,
                to_date: to_date,
                hotel_id,
                name: name,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                totalDebitAmount,
                totalCreditAmount,
                data,
            };
        });
    }
}
exports.AccountReportService = AccountReportService;
exports.default = AccountReportService;
//# sourceMappingURL=report.account.service.js.map