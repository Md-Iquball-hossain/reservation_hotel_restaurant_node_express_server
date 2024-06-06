"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MUserValidator {
    constructor() {
        // create user input validator
        this.createUserValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().lowercase().trim().regex(/^\S/).required(),
            city: joi_1.default.string().lowercase().trim().regex(/^\S/).required(),
            country: joi_1.default.string().lowercase().trim().regex(/^\S/).required(),
            expiry_date: joi_1.default.date().required(),
            group: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
        });
        // update user input validator
        this.updateUserValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            expiry_date: joi_1.default.date().optional(),
        });
        // get all user validator
        this.getAllUserValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            group: joi_1.default.string().optional(),
            city: joi_1.default.string().optional(),
            status: joi_1.default.string()
                .valid("active", "inactive", "blocked", "expired")
                .optional(),
            from_date: joi_1.default.date().optional(),
            to_date: joi_1.default.date().optional(),
        });
    }
}
exports.default = MUserValidator;
//# sourceMappingURL=mUser.validator.js.map