"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class GuestValidator {
    constructor() {
        // create guest validator
        this.createGuestValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string()
                .email()
                .lowercase()
                .trim()
                .regex(/^\S/)
                .required(),
            city: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            phone: joi_1.default.number().allow("").optional(),
            country: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            address: joi_1.default.string().allow("").optional(),
            zip_code: joi_1.default.number().allow("").optional(),
            postal_code: joi_1.default.number().allow("").optional(),
            user_type: joi_1.default.string().valid('guest', 'user', 'hall-guest', 'room-guest').required(),
        });
        // get all guest list validator
        this.getAllGuestValidator = joi_1.default.object({
            key: joi_1.default.string().allow("").optional(),
            email: joi_1.default.string().allow("").optional(),
            user_type: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
        // get all guest list validator
        this.getHallGuestValidator = joi_1.default.object({
        // id: Joi.number().allow("").optional(),
        });
    }
}
exports.default = GuestValidator;
//# sourceMappingURL=guest.validation.js.map