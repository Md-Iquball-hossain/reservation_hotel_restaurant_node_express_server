"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class HotelRestaurantValidator {
    constructor() {
        // create hotel Restaurant validation
        this.createRestaurantValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            res_email: joi_1.default.string().email().lowercase().trim().regex(/^\S/).required(),
            phone: joi_1.default.number().optional(),
            admin_name: joi_1.default.string().required(),
            email: joi_1.default.string().email().lowercase().trim().regex(/^\S/).required(),
            bin_no: joi_1.default.number().optional(),
            address: joi_1.default.string().optional(),
            password: joi_1.default.string().min(8).required(),
            permission: joi_1.default.array().items(joi_1.default.number().required()).required(),
        });
        // update hotel restaurant validation
        this.updateHotelRestaurantValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().valid("0", "1"),
        });
        // get all Restaurant query validator
        this.getAllRestaurantQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = HotelRestaurantValidator;
//# sourceMappingURL=restaurant.hotel.validator.js.map