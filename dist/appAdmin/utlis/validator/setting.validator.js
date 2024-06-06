"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class SettingValidator {
    constructor() {
        //=================== Room Type validation ======================//
        // create room Type validation
        this.createRoomTypeValidator = joi_1.default.object({
            room_type: joi_1.default.string().lowercase().allow("").required(),
        });
        // get all room Type query validator
        this.getAllRoomTypeQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            room_type: joi_1.default.string().allow("").optional(),
        });
        // update room type validation
        this.UpdateRoomTypeValidator = joi_1.default.object({
            room_type: joi_1.default.string().required(),
        });
        //=================== Bed Type validation ======================//
        // create bed Type validation
        this.createBedTypeValidator = joi_1.default.object({
            bed_type: joi_1.default.string().allow("").required(),
        });
        // get all Bed Type query validator
        this.getAllBedTypeQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            bed_type: joi_1.default.string().allow("").optional(),
        });
        // update bed type validation
        this.UpdateBedTypeValidator = joi_1.default.object({
            bed_type: joi_1.default.string().required(),
        });
        //=================== Room Amenities validation ======================//
        // create Room Amenities validation
        this.createRoomAmenitiesValidator = joi_1.default.object({
            room_amenities: joi_1.default.string().allow("").required(),
        });
        // get all Room Amenities query validator
        this.getAllRoomAmenitiesQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            room_amenities: joi_1.default.string().allow("").optional(),
        });
        // update Room Amenities validation
        this.UpdateRoomAmenitiesValidator = joi_1.default.object({
            room_amenities: joi_1.default.string().required(),
        });
        //=================== Bank Name validation ======================//
        // create Bank Name
        this.createBankNameValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
        });
        // get all Bank Name
        this.getAllBankNameQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
        // update Bank Name
        this.UpdateBankNameValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        //=================== designation validation ======================//
        // create designation validation
        this.createdesignationValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
        });
        // get all designation query validation
        this.getAlldesignationQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
        // update designation validation
        this.UpdatedesignationValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        //=================== department validation ======================//
        // create department validation
        this.createdepartmentValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
        });
        // get all department query validation
        this.getAlldepartmentQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
        // update department validation
        this.UpdatedepatmentValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        //=================== Hall Amenities validation ======================//
        // create Hall Amenities validation
        this.createHallAmenitiesValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            description: joi_1.default.string().allow("").optional(),
        });
        // get all Hall Amenities query validator
        this.getAllHallAmenitiesQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
        // update Hall Amenities validation
        this.UpdateHallAmenitiesValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            description: joi_1.default.string().allow("").optional(),
        });
        //=================== PayRoll Months validation ======================//
        // create PayRoll Months validation
        this.createPayRollMonthsValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            days: joi_1.default.number().optional(),
            hours: joi_1.default.number().allow("").required(),
        });
        // get all PayRoll Months query validation
        this.getAllPayrollMonthsQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
        // update PayRoll Months validation
        this.UpdatePayrollMonthsValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            days: joi_1.default.number().optional(),
            hours: joi_1.default.number().allow("").optional(),
        });
    }
}
exports.default = SettingValidator;
//# sourceMappingURL=setting.validator.js.map