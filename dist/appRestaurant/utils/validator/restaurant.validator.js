"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class RestaurantValidator {
    constructor() {
        // create Restaurant validation
        this.updateRestaurantValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            phone: joi_1.default.number().optional(),
            photo: joi_1.default.string().optional(),
            address: joi_1.default.string().optional(),
            city: joi_1.default.string().optional(),
            country: joi_1.default.string().optional(),
            bin_no: joi_1.default.string().optional(),
        });
        // create Restaurant Admin validation
        this.updateRestaurantAdminValidator = joi_1.default.object({
            name: joi_1.default.string().allow().optional(),
            avatar: joi_1.default.string().allow().optional(),
            phone: joi_1.default.number().allow().optional(),
            status: joi_1.default.valid("active", "inactive").optional()
        });
    }
}
exports.default = RestaurantValidator;
//# sourceMappingURL=restaurant.validator.js.map