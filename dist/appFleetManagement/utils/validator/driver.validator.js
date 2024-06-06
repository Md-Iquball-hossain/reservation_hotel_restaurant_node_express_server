"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class DriverValidator {
    constructor() {
        // create Driver
        this.createDriverValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string()
                .email()
                .lowercase()
                .trim()
                .regex(/^\S/)
                .optional(),
            phone: joi_1.default.number().required(),
            address: joi_1.default.string().required(),
            photo: joi_1.default.string().allow("").optional(),
            blood_group: joi_1.default.string().lowercase().
                valid('a+', 'b+', 'ab+', 'a-', 'b-', 'ab-', 'o+', 'o-'),
            date_of_birth: joi_1.default.date().required(),
            licence_number: joi_1.default.string().required(),
            licence_photo: joi_1.default.string().allow("").optional(),
            license_class: joi_1.default.string().valid('motorcycle', 'light-motor-vehicle', 'heavy-motor-vehicle', 'three-wheeler', 'invalid-carriage', 'tractor', 'ambulance', 'fire-truck'),
            expiry_date: joi_1.default.date().required(),
            year_of_experience: joi_1.default.number().allow("").optional(),
            emr_contact_name: joi_1.default.string().allow("").optional(),
            emr_contact_number: joi_1.default.number().allow("").optional(),
        });
        // get all Driver
        this.getAllDriverValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
        });
        // update Driver
        this.updateDriverValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            email: joi_1.default.string()
                .email()
                .lowercase()
                .trim()
                .regex(/^\S/)
                .optional(),
            phone: joi_1.default.number().optional(),
            address: joi_1.default.string().optional(),
            photo: joi_1.default.string().allow("").optional(),
            blood_group: joi_1.default.string().lowercase().
                valid('a+', 'b+', 'ab+', 'a-', 'b-', 'ab-', 'o+', 'o-'),
            date_of_birth: joi_1.default.date().required(),
            licence_number: joi_1.default.string().optional(),
            licence_photo: joi_1.default.string().allow("").optional(),
            license_class: joi_1.default.string().valid('motorcycle', 'light-motor-vehicle', 'heavy-motor-vehicle', 'three-wheeler', 'invalid-carriage', 'tractor', 'ambulance', 'fire-truck'),
            expiry_date: joi_1.default.date().optional(),
            year_of_experience: joi_1.default.number().allow("").optional(),
            emr_contact_name: joi_1.default.string().allow("").optional(),
            emr_contact_number: joi_1.default.number().allow("").optional(),
            status: joi_1.default.number().valid(0, 1)
        });
    }
}
exports.default = DriverValidator;
//# sourceMappingURL=driver.validator.js.map