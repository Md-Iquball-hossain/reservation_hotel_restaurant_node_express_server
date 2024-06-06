"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ExpenseValidator {
    constructor() {
        // create expense head validator
        this.createExpenseHeadValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        //update expense head validator
        this.UpdateExpenseHeadValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        // create expense validator
        this.createExpenseValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            ac_tr_ac_id: joi_1.default.number().required(),
            expense_date: joi_1.default.date().required(),
            remarks: joi_1.default.string().allow("").optional(),
            expense_item: joi_1.default.array()
                .items(joi_1.default.object({
                name: joi_1.default.string().required(),
                amount: joi_1.default.number().required(),
            }))
                .required(),
        });
        // get all room booking query validator
        this.getAllExpenseQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().optional(),
            skip: joi_1.default.string().optional(),
            key: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = ExpenseValidator;
//# sourceMappingURL=expense.validator.js.map