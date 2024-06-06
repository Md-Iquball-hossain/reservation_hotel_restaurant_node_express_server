"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MoneyRecieptValidator {
    constructor() {
        // create money reciept
        this.createMoneyReciept = joi_1.default.object({
            ac_tr_ac_id: joi_1.default.number().required(),
            user_id: joi_1.default.number().required(),
            paid_amount: joi_1.default.number().required(),
            reciept_type: joi_1.default.string().valid("invoice", "overall").required(),
            invoice_id: joi_1.default.number().optional(),
            remarks: joi_1.default.string().required(),
        });
        // get all money reciept validator
        this.getAllMoneyReciept = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
        });
        // advance return money reciept
        this.advanceReturnMoneyReciept = joi_1.default.object({
            ac_tr_ac_id: joi_1.default.number().required(),
            user_id: joi_1.default.number().required(),
            return_amount: joi_1.default.number().required(),
            return_date: joi_1.default.string().required(),
            remarks: joi_1.default.string().required(),
        });
        // get all advance money reciept validator
        this.getAllAdvanceMoneyReciept = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = MoneyRecieptValidator;
//# sourceMappingURL=money-reciept.validator.js.map