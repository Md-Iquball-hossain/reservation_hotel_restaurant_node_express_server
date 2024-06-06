"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class FuelValidator {
    constructor() {
        // create Fuel Refill
        this.createFuelValidator = joi_1.default.object({
            vehicle_id: joi_1.default.number().required(),
            filling_station_name: joi_1.default.string().required(),
            fuel_quantity: joi_1.default.number().required(),
            per_quantity_amount: joi_1.default.number().required(),
            refilled_by: joi_1.default.string().allow("").optional(),
            refilled_date: joi_1.default.date().required(),
        });
        // get all Fuel Refill Details
        this.getAllFuelValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional()
        });
    }
}
exports.default = FuelValidator;
//# sourceMappingURL=fuel.validator.js.map