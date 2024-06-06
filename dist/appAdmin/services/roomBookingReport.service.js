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
exports.RoomBookingReportService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class RoomBookingReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get Hotel Room Booking report Service
    getRoomBookingReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, limit, skip } = req.query;
            const { hotel_id } = req.hotel_admin;
            // model
            const model = this.Model.reportModel();
            const { data, total } = yield model.getRoomBookingReport({
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
}
exports.RoomBookingReportService = RoomBookingReportService;
exports.default = RoomBookingReportService;
//# sourceMappingURL=roomBookingReport.service.js.map