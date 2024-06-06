"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class RestaurantValidator {
    constructor() {
        // create Restaurant validation
        this.createRestaurantValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            phone: joi_1.default.number().allow("").optional(),
            email: joi_1.default.string()
                .email()
                .lowercase()
                .trim()
                .regex(/^\S/)
                .required(),
            tin_no: joi_1.default.number().allow("").optional(),
            address: joi_1.default.string().allow("").optional(),
            password: joi_1.default.string().allow("").required(),
        });
        // get all Restaurant query validator
        this.getAllRestaurantQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = RestaurantValidator;
//# sourceMappingURL=restaurant.validator.js.map