"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class PayRollValidator {
    constructor() {
        this.CreatePayrollValidator = joi_1.default.object({
            employee_id: joi_1.default.number().required(),
            ac_tr_ac_id: joi_1.default.number().required(),
            attendance_days: joi_1.default.number().optional(),
            advance_salary: joi_1.default.number().optional(),
            working_hours: joi_1.default.number().optional(),
            provident_fund: joi_1.default.number().optional(),
            mobile_bill: joi_1.default.number().optional(),
            feed_allowance: joi_1.default.number().optional(),
            perform_bonus: joi_1.default.number().optional(),
            festival_bonus: joi_1.default.string().allow("").optional(),
            travel_allowance: joi_1.default.string().allow("").optional(),
            health_allowance: joi_1.default.string().allow("").optional(),
            incentive: joi_1.default.string().allow("").optional(),
            house_rent: joi_1.default.string().allow("").optional(),
            salary_date: joi_1.default.string().required(),
            gross_salary: joi_1.default.number().required(),
            total_salary: joi_1.default.number().required(),
            docs: joi_1.default.string().allow("").optional(),
            note: joi_1.default.string().allow("").optional(),
            deductions: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const deductionType = typeof parsedObject;
                    if (deductionType !== "object") {
                        return helpers.message({
                            custom: "invalid deductions, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid deductions, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
            others: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const otherType = typeof parsedObject;
                    if (otherType !== "object") {
                        return helpers.message({
                            custom: "invalid others, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid others, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
        });
        // get all Pay Roll query validator
        this.getAllPayRollValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
        });
        // Params id Validator
        this.PayrollidValidator = joi_1.default.object({
            id: joi_1.default.number().required(),
        });
    }
}
exports.default = PayRollValidator;
//# sourceMappingURL=payRoll.validator.js.map