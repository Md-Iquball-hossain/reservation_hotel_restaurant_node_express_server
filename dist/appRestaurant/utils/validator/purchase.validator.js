"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class PurchaseValidator {
    constructor() {
        // create Purchase validation
        this.createPurchaseValidator = joi_1.default.object({
            purchase_date: joi_1.default.string().allow("").required(),
            supplier_id: joi_1.default.number().allow("").required(),
            ac_tr_ac_id: joi_1.default.number().allow("").optional(),
            discount_amount: joi_1.default.number().allow("").optional(),
            purchase_items: joi_1.default.array()
                .items(joi_1.default.object({
                ingredient_id: joi_1.default.number().required(),
                name: joi_1.default.string().required(),
                quantity: joi_1.default.number().required(),
                price: joi_1.default.number().required(),
            }))
                .required(),
        });
        // get all Purchase query validator
        this.getAllPurchaseQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
        });
        // get all account query validator
        this.getAllAccountQueryValidator = joi_1.default.object({
            status: joi_1.default.string().valid("0", "1"),
            ac_type: joi_1.default.string()
                .lowercase()
                .valid("bank", "cash", "cheque", "mobile-banking")
                .optional(),
            key: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = PurchaseValidator;
//# sourceMappingURL=purchase.validator.js.map