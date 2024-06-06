"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class TripValidator {
    constructor() {
        // create Trip
        this.createTripValidator = joi_1.default.object({
            vehicle_id: joi_1.default.number().required(),
            driver_id: joi_1.default.number().required(),
            start_location: joi_1.default.string().required(),
            end_location: joi_1.default.string().required(),
            trip_start: joi_1.default.date().required(),
            trip_end: joi_1.default.date().required(),
            distance: joi_1.default.number().allow("").optional(),
            fuel_usage: joi_1.default.number().required(),
            trip_cost: joi_1.default.number().allow("").optional(),
        });
        // get all Trip
        this.getAllTripValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            driver_id: joi_1.default.string().allow("").optional(),
            vehicle_id: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional()
        });
    }
}
exports.default = TripValidator;
//# sourceMappingURL=trip.validator.js.map