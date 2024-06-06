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
exports.clientLedgerReportService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class clientLedgerReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getClientLedgerReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, limit, skip, pay_type, user_id } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.reportModel();
            const { totalAmount, data, total } = yield model.getClientLedgerReport({
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                user_id: user_id,
                pay_type: pay_type,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                totalAmount,
                data,
            };
        });
    }
}
exports.clientLedgerReportService = clientLedgerReportService;
exports.default = clientLedgerReportService;
//# sourceMappingURL=report.client-ledger.service.js.map