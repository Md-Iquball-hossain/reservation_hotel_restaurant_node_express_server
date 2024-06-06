"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AccountValidator {
    constructor() {
        // create account validator
        this.createAccountValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            ac_type: joi_1.default.string()
                .lowercase()
                .valid("bank", "cash", "cheque", "mobile-banking")
                .required(),
            bank: joi_1.default.string().allow("").optional(),
            branch: joi_1.default.string().allow("").optional(),
            account_number: joi_1.default.string().allow("").required(),
            opening_balance: joi_1.default.number().optional(),
            details: joi_1.default.string().allow("").optional(),
        });
        // get all account query validator
        this.getAllAccountQueryValidator = joi_1.default.object({
            status: joi_1.default.string().valid("0", "1"),
            ac_type: joi_1.default.string()
                .lowercase()
                .valid("bank", "cash", "cheque", "mobile-banking")
                .optional(),
            key: joi_1.default.string().allow("").optional(),
            admin_id: joi_1.default.number().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
        // update account validator
        this.updateAccountValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            ac_type: joi_1.default.string()
                .lowercase()
                .valid("bank", "cash", "cheque", "mobile-banking")
                .required(),
            bank: joi_1.default.string().allow("").optional(),
            branch: joi_1.default.string().allow("").optional(),
            account_number: joi_1.default.string().allow("").optional(),
            opening_balance: joi_1.default.number().optional(),
            details: joi_1.default.string().allow("").optional(),
            status: joi_1.default.number().optional(),
        });
        // balance transfer
        this.balanceTransferValidator = joi_1.default.object({
            transfer_type: joi_1.default.string()
                .lowercase()
                .valid("by_account", "overall")
                .required(),
            from_account: joi_1.default.number().optional(),
            to_account: joi_1.default.number().optional(),
            pay_amount: joi_1.default.number().optional(),
        });
    }
}
exports.default = AccountValidator;
//# sourceMappingURL=account.validator.js.map