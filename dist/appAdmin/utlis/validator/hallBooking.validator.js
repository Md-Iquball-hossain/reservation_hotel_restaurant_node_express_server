"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class HallBookingValidator {
    constructor() {
        // create hall booking validator
        this.createHallBookingValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            city: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            phone: joi_1.default.number().allow("").optional(),
            country: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            address: joi_1.default.string().allow("").optional(),
            zip_code: joi_1.default.number().allow("").optional(),
            postal_code: joi_1.default.number().allow("").optional(),
            start_time: joi_1.default.string().required(),
            end_time: joi_1.default.string().required(),
            booking_date: joi_1.default.string().required(),
            event_date: joi_1.default.string().required(),
            total_occupancy: joi_1.default.number().required(),
            discount_amount: joi_1.default.number().optional(),
            tax_amount: joi_1.default.number().optional(),
            paid_amount: joi_1.default.number().required(),
            ac_tr_ac_id: joi_1.default.number().optional(),
            extra_charge: joi_1.default.number().optional(),
            check_in: joi_1.default.string().allow("").optional(),
            booking_halls: joi_1.default.array()
                .items(joi_1.default.object({
                hall_id: joi_1.default.number().required(),
                quantity: joi_1.default.number().optional(),
            }))
                .required(),
            payment_type: joi_1.default.string()
                .valid("bank", "cash", "cheque", "mobile-banking")
                .optional(),
        });
        // get all hall booking query validator
        this.getAllHallBookingQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            booking_status: joi_1.default.string().allow("").optional(),
            start_time: joi_1.default.string().allow("").optional(),
            end_time: joi_1.default.string().allow("").optional(),
            event_date: joi_1.default.string().allow("").optional(),
            user_id: joi_1.default.string().allow("").optional(),
        });
        // insert hall booking check in
        this.insertHallBookingCheckIn = joi_1.default.object({
            booking_id: joi_1.default.number().required(),
            check_in: joi_1.default.string().required(),
            event_date: joi_1.default.string().required(),
        });
        // add hall booking check out
        this.addHallBookingCheckOut = joi_1.default.object({
            check_out: joi_1.default.string().required(),
            event_date: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = HallBookingValidator;
//# sourceMappingURL=hallBooking.validator.js.map