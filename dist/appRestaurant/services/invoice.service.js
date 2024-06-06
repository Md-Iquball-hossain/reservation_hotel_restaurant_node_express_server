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
class InvoiceService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Invoice ======================//
    // get All invoice service
    getAllInvoice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, key, limit, skip, due_inovice } = req.query;
            const { res_id } = req.rest_user;
            // model
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllInvoice({
                res_id,
                from_date: from_date,
                to_date: to_date,
                key: key,
                limit: limit,
                skip: skip,
                due_inovice: due_inovice,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // Get Single Invoice
    getSingleInvoice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const model = this.Model.restaurantModel();
            const singleInvoiceData = yield model.getSingleInvoice({
                res_id: req.rest_user.res_id,
                id: parseInt(id),
            });
            if (!singleInvoiceData.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: singleInvoiceData[0],
            };
        });
    }
}
exports.default = InvoiceService;
//# sourceMappingURL=invoice.service.js.map