"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class RoomValidator {
    constructor() {
        // create room validator
        this.createRoomValidator = joi_1.default.object({
            room_number: joi_1.default.string().required(),
            room_type: joi_1.default.string().allow("").required(),
            room_size: joi_1.default.string().allow("").optional(),
            occupancy: joi_1.default.number().allow("").optional(),
            bed_type: joi_1.default.string().allow("").required(),
            rate_per_night: joi_1.default.number().required(),
            availability: joi_1.default.number().optional(),
            discount_percent: joi_1.default.number().allow("").optional(),
            tax_percent: joi_1.default.number().allow("").optional(),
            description: joi_1.default.string().allow("").optional(),
            refundable: joi_1.default.number().default(1),
            discount: joi_1.default.number().allow("").optional(),
            refundable_time: joi_1.default.number().allow("").optional(),
            refundable_charge: joi_1.default.number().allow("").optional(),
            aminities_charge: joi_1.default.number().allow("").optional(),
            child: joi_1.default.number().allow("").optional(),
            adult: joi_1.default.number().allow("").required(),
            room_amenities: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const roomAminitesType = typeof parsedObject;
                    if (roomAminitesType !== "object") {
                        return helpers.message({
                            custom: "invalid room_aminities, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid room_aminities, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
        });
        // get all hotel room validator
        this.getAllHotelRoomQueryValidator = joi_1.default.object({
            key: joi_1.default.string().allow("").optional(),
            availability: joi_1.default.string().allow("").optional(),
            refundable: joi_1.default.string().allow("").optional(),
            occupancy: joi_1.default.string().allow("").optional(),
            child: joi_1.default.number().allow("").optional(),
            adult: joi_1.default.number().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
        // update hotel room validator
        this.updateHotelRoomValidator = joi_1.default.object({
            room_number: joi_1.default.string().optional(),
            room_type: joi_1.default.string().allow("").optional(),
            room_size: joi_1.default.string().allow("").optional(),
            occupancy: joi_1.default.number().allow("").optional(),
            bed_type: joi_1.default.string().allow("").optional(),
            rate_per_night: joi_1.default.number().optional(),
            room_view: joi_1.default.string().allow("").optional(),
            availability: joi_1.default.number().optional(),
            discount_percent: joi_1.default.number().allow("").optional(),
            tax_percent: joi_1.default.number().allow("").optional(),
            description: joi_1.default.string().allow("").optional(),
            refundable: joi_1.default.number().default(1),
            discount: joi_1.default.number().allow("").optional(),
            refundable_time: joi_1.default.number().allow("").optional(),
            refundable_charge: joi_1.default.number().allow("").optional(),
            aminities_charge: joi_1.default.number().allow("").optional(),
            child: joi_1.default.number().optional(),
            remove_photos: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedArray = JSON.parse(value);
                    if (!Array.isArray(parsedArray)) {
                        return helpers.message({
                            custom: "invalid remove_photos, remove_photos will be json array of number",
                        });
                    }
                    for (const item of parsedArray) {
                        if (typeof item !== "number") {
                            return helpers.message({
                                custom: "invalid remove_photos array item type, item type will be number",
                            });
                        }
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid remove_photos, remove_photos will be json array of number",
                    });
                }
            })
                .optional(),
            adult: joi_1.default.number().optional(),
            room_amenities: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const roomAminitesType = typeof parsedObject;
                    if (roomAminitesType !== "object") {
                        return helpers.message({
                            custom: "invalid room_aminities, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid room_aminities, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
            remove_amenities: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedArray = JSON.parse(value);
                    if (!Array.isArray(parsedArray)) {
                        return helpers.message({
                            custom: "invalid remove_amnities, remove_amnities will be json array of number",
                        });
                    }
                    for (const item of parsedArray) {
                        if (typeof item !== "number") {
                            return helpers.message({
                                custom: "invalid remove_amnities array item type, item type will be number",
                            });
                        }
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid remove_amnities, remove_amnities will be json array of number",
                    });
                }
            })
                .optional(),
        });
    }
}
exports.default = RoomValidator;
//# sourceMappingURL=Room.validator.js.map