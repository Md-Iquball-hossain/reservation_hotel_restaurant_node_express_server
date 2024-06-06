"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class RoomBookingValidator {
    constructor() {
        // create room booking validator
        this.createRoomBookingValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            check_in_time: joi_1.default.string().required(),
            check_out_time: joi_1.default.string().required(),
            nid_no: joi_1.default.number().allow("").optional(),
            passport_no: joi_1.default.string().allow("").optional(),
            discount_amount: joi_1.default.number().required(),
            tax_amount: joi_1.default.number().required(),
            total_occupancy: joi_1.default.number().required(),
            extra_charge: joi_1.default.number().optional(),
            booking_rooms: joi_1.default.array()
                .items(joi_1.default.object({
                room_id: joi_1.default.number().required(),
            }))
                .required(),
            paid_amount: joi_1.default.number().required(),
            ac_tr_ac_id: joi_1.default.number().optional(),
            payment_type: joi_1.default.string()
                .valid("bank", "cash", "cheque", "mobile-banking")
                .optional(),
        });
        // get all room booking query validator
        this.getAllRoomBookingQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().optional(),
            skip: joi_1.default.string().optional(),
            name: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
            user_id: joi_1.default.string().allow("").optional(),
        });
        // insert booking check in
        this.insertBookingCheckIn = joi_1.default.object({
            booking_id: joi_1.default.number().required(),
            check_in: joi_1.default.string().required(),
        });
        // add booking check out
        this.addBookingCheckOut = joi_1.default.object({
            check_out: joi_1.default.string().required(),
        });
    }
}
exports.default = RoomBookingValidator;
//# sourceMappingURL=roomBooking.validator.js.map