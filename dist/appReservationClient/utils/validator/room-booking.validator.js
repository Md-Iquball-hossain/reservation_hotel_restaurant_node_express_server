"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class UserRoomBookingValidator {
    constructor() {
        // create room booking validator
        this.createRoomBookingValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            email: joi_1.default.string().allow("").required(),
            city: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            phone: joi_1.default.number().allow("").optional(),
            country: joi_1.default.string().lowercase().trim().regex(/^\S/).optional(),
            address: joi_1.default.string().allow("").optional(),
            zip_code: joi_1.default.number().allow("").optional(),
            postal_code: joi_1.default.number().allow("").optional(),
            check_in_time: joi_1.default.string().required(),
            check_out_time: joi_1.default.string().required(),
            nid_no: joi_1.default.number().allow("").optional(),
            passport_no: joi_1.default.string().allow("").optional(),
            discount_amount: joi_1.default.number().optional(),
            tax_amount: joi_1.default.number().optional(),
            total_occupancy: joi_1.default.number().optional(),
            extra_charge: joi_1.default.number().optional(),
            paid_amount: joi_1.default.number().optional(),
            ac_tr_ac_id: joi_1.default.number().optional(),
            payment_type: joi_1.default.string()
                .valid("bank", "cash", "cheque", "mobile-banking")
                .optional(),
            booking_rooms: joi_1.default.array()
                .items(joi_1.default.object({
                room_id: joi_1.default.number().required(),
            }))
                .required(),
        });
        // get all room booking query validator
        this.getAllRoomBookingQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
            user_id: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = UserRoomBookingValidator;
//# sourceMappingURL=room-booking.validator.js.map