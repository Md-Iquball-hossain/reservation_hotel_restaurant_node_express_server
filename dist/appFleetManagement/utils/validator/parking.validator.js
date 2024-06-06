"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ParkingValidator {
    constructor() {
        // create Parking
        this.createParkingValidator = joi_1.default.object({
            parking_area: joi_1.default.string().required(),
            parking_size: joi_1.default.string().valid('compact', 'standard', 'large'),
            par_slot_number: joi_1.default.string().allow("").optional(),
        });
        // get all Parking
        this.getAllParkingValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            parking_size: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
        });
        // update Parking
        this.updateParkingValidator = joi_1.default.object({
            parking_area: joi_1.default.string().allow("").optional(),
            parking_size: joi_1.default.string().valid('compact', 'standard', 'large'),
            par_slot_number: joi_1.default.string().allow("").optional(),
            status: joi_1.default.number().valid(0, 1),
        });
        // create Vehicle Parking
        this.createVehicleParkingValidator = joi_1.default.object({
            vehicle_id: joi_1.default.number().required(),
            parking_id: joi_1.default.number().required(),
            assigned_time: joi_1.default.date().allow("").optional(),
        });
        // get all  vehicle Parking
        this.getAllVehicleParkingValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
            vehicle_id: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional()
        });
        // update vehicle Parking
        this.updateVehicleParkingValidator = joi_1.default.object({
            vehicle_id: joi_1.default.number().allow("").optional(),
            left_time: joi_1.default.date().allow("").optional(),
        });
    }
}
exports.default = ParkingValidator;
//# sourceMappingURL=parking.validator.js.map