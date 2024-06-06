"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class EmployeeValidator {
    constructor() {
        // create employee validator
        this.createEmployeeValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            department_id: joi_1.default.number().required(),
            designation_id: joi_1.default.number().required(),
            res_id: joi_1.default.number().allow("").optional(),
            category: joi_1.default.string()
                .valid("restaurant", "hotel", "management")
                .optional(),
            blood_group: joi_1.default.string()
                .valid("a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-")
                .optional(),
            salary: joi_1.default.number().optional(),
            email: joi_1.default.string().allow("").optional(),
            mobile_no: joi_1.default.string().allow("").required(),
            birth_date: joi_1.default.string().optional(),
            appointment_date: joi_1.default.string().optional(),
            joining_date: joi_1.default.string().optional(),
            address: joi_1.default.string().allow("").optional(),
        });
        // get all Employee query validator
        this.getAllEmployeeQueryValidator = joi_1.default.object({
            status: joi_1.default.string().valid("0", "1"),
            category: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
        // update employee validator
        this.updateEmployeeValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            department_id: joi_1.default.number().optional(),
            res_id: joi_1.default.number().allow("").optional(),
            designation_id: joi_1.default.number().optional(),
            blood_group: joi_1.default.string()
                .valid("a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-")
                .optional(),
            salary: joi_1.default.number().optional(),
            status: joi_1.default.number().optional(),
            mobile_no: joi_1.default.string().allow("").optional(),
            birth_date: joi_1.default.string().optional(),
            appointment_date: joi_1.default.string().optional(),
            category: joi_1.default.string()
                .valid("restaurant", "hotel", "management")
                .optional(),
            joining_date: joi_1.default.string().optional(),
            address: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = EmployeeValidator;
//# sourceMappingURL=employee.validator.js.map