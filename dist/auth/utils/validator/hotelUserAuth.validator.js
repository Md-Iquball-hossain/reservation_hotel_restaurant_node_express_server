"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class HoteUserAuthValidator {
    constructor() {
        // profile registartion validator
        this.registrationValidator = joi_1.default.object({
            hotel_id: joi_1.default.number().optional(),
            name: joi_1.default.string().allow("").required(),
            email: joi_1.default.string()
                .email()
                .lowercase()
                .trim()
                .regex(/^\S/)
                .required(),
            city: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            photo: joi_1.default.string().allow("").optional(),
            country: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            address: joi_1.default.string().allow("").optional(),
            phone: joi_1.default.string().allow("").optional(),
            zip_code: joi_1.default.string().allow("").optional(),
            postal_code: joi_1.default.string().allow("").optional(),
            password: joi_1.default.string().allow("").required(),
        });
        // update profile validator
        this.updateProfileValidator = joi_1.default.object({
            hotel_id: joi_1.default.number().optional(),
            email: joi_1.default.string()
                .email()
                .lowercase()
                .trim()
                .regex(/^\S/)
                .required(),
            name: joi_1.default.string().allow("").optional(),
            phone: joi_1.default.string().allow("").optional(),
            nid_no: joi_1.default.string().allow("").optional(),
            passport_no: joi_1.default.string().allow("").optional(),
            photo: joi_1.default.string().allow("").optional(),
            city: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            address: joi_1.default.string().allow("").optional(),
            zip_code: joi_1.default.string().allow("").optional(),
            postal_code: joi_1.default.string().allow("").optional(),
            country: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
        });
    }
}
exports.default = HoteUserAuthValidator;
//# sourceMappingURL=hotelUserAuth.validator.js.map