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
class ResReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Supplier ledger
    getSupplierLedger(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, limit, skip, supplier_id } = req.query;
            const { res_id } = req.rest_user;
            // model
            const model = this.Model.restaurantModel();
            const { totalCreditAmount, data, total } = yield model.getSupplierReport({
                supplier_id: supplier_id,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                res_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                totalCreditAmount,
                data,
            };
        });
    }
    // Purchase
    getPurchaseReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, limit, skip, name } = req.query;
            const { res_id } = req.rest_user;
            // model
            const model = this.Model.restaurantModel();
            const { totalAmount, data, total } = yield model.getPurchaseReport({
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                res_id,
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
    // Food Category
    getFoodCategoryReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, limit, skip, category_name, food_name } = req.query;
            const { res_id } = req.rest_user;
            // model
            const model = this.Model.restaurantModel();
            const { totalSoldQuantity, data, total } = yield model.getFoodCategoryReport({
                category_name: category_name,
                food_name: food_name,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                res_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                totalSoldQuantity,
                data,
            };
        });
    }
    // Sales
    getSalesReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, limit, skip, name } = req.query;
            const { res_id } = req.rest_user;
            // model
            const model = this.Model.restaurantModel();
            const { totalAmount, totalSold, data, total } = yield model.getSalesReport({
                name: name,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                res_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                totalAmount,
                totalSold,
                data,
            };
        });
    }
    // Expense
    getExpenseReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, limit, skip, name } = req.query;
            const { res_id } = req.rest_user;
            // model
            const model = this.Model.restaurantModel();
            const { totalAmount, data, total } = yield model.getExpenseReport({
                name: name,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                res_id,
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
exports.default = ResReportService;
//# sourceMappingURL=report.service.js.map