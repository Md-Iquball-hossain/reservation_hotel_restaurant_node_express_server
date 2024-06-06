"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class VehiclesValidator {
    constructor() {
        // create vehicles
        this.createVehicleValidator = joi_1.default.object({
            reg_number: joi_1.default.string().allow("").optional(),
            model: joi_1.default.string().required(),
            mileage: joi_1.default.number().allow("").optional(),
            manufacturer: joi_1.default.string().allow("").optional(),
            manufacture_year: joi_1.default.date().allow("").optional(),
            license_plate: joi_1.default.string().required(),
            license_expired: joi_1.default.date().allow("").optional(),
            tax_token: joi_1.default.string().allow("").optional(),
            token_expired: joi_1.default.date().allow("").optional(),
            insurance_number: joi_1.default.string().allow("").optional(),
            insurance_expired: joi_1.default.date().allow("").optional(),
            vehicle_type: joi_1.default.string().valid('motorcycle', 'car', 'suv', 'others'),
            fuel_type: joi_1.default.string().valid('gasoline', 'diesel', 'lpg', 'coal', 'natural-gas', 'bio-fuels', 'hydrogen', 'nuclear'),
            vehicle_color: joi_1.default.string().required(),
            vehicle_photo: joi_1.default.string().allow("").optional(),
        });
        // get all vehicles
        this.getAllVehicleValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
        });
        // update vehicles
        this.updateVehicleValidator = joi_1.default.object({
            owner_id: joi_1.default.number().optional(),
            reg_number: joi_1.default.string().allow("").optional(),
            model: joi_1.default.string().allow("").optional(),
            mileage: joi_1.default.number().allow("").optional(),
            manufacturer: joi_1.default.string().allow("").optional(),
            manufacture_year: joi_1.default.date().allow("").optional(),
            license_plate: joi_1.default.string().allow("").optional(),
            license_expired: joi_1.default.date().optional(),
            tax_token: joi_1.default.string().allow("").optional(),
            token_expired: joi_1.default.date().allow("").optional(),
            insurance_number: joi_1.default.string().allow("").optional(),
            insurance_expired: joi_1.default.date().allow("").optional(),
            vehicle_type: joi_1.default.string().valid('motorcycle', 'car', 'suv', 'others').optional(),
            fuel_type: joi_1.default.string().valid('gasoline', 'diesel', 'lpg', 'coal', 'natural-gas', 'bio-fuels', 'hydrogen', 'nuclear').optional(),
            status: joi_1.default.string().valid('available', 'maintenance', 'on-trip').optional(),
            vehicle_color: joi_1.default.string().allow("").optional(),
            vehicle_photo: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = VehiclesValidator;
//# sourceMappingURL=vehicles.validator.js.map