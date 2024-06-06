"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class InvoiceValidator {
    constructor() {
        // get all invoice validator
        this.getAllInvoiceValidator = joi_1.default.object({
            key: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            due_inovice: joi_1.default.string().valid("1").optional(),
            user_id: joi_1.default.string().optional(),
        });
        // create invoice validator
        this.createInvoiceValidator = joi_1.default.object({
            user_id: joi_1.default.number().required(),
            discount_amount: joi_1.default.number().required(),
            tax_amount: joi_1.default.number().required(),
            invoice_item: joi_1.default.array()
                .items(joi_1.default.object({
                name: joi_1.default.string().required(),
                total_price: joi_1.default.number().required(),
                quantity: joi_1.default.number().required(),
            }))
                .required(),
        });
    }
}
exports.default = InvoiceValidator;
//# sourceMappingURL=invoice.validator.js.map