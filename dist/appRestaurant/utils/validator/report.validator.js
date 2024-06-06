"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ResReportValidator {
    constructor() {
        // get Supplier Report validator
        this.getSupplierReportValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            supplier_id: joi_1.default.string().allow("").optional(),
            ac_tr_ac_id: joi_1.default.string().allow("").optional(),
        });
        // get Purchase Report validator
        this.getPurchaseReportValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
        });
        // get Purchase Report validator
        this.getFoodCategoryReportValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            food_name: joi_1.default.string().allow("").optional(),
            category_name: joi_1.default.string().allow("").optional(),
        });
        // get Sales Report validator
        this.getSalesReportValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
        // get Sales Report validator
        this.getExpenseReportValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = ResReportValidator;
//# sourceMappingURL=report.validator.js.map