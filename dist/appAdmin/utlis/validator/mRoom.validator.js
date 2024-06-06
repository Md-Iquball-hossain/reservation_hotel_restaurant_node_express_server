"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class RroomValidator {
    constructor() {
        this.createRoomValidator = joi_1.default.object({
            room_number: joi_1.default.string().optional(),
            room_type: joi_1.default.string().allow(" ", null).optional(),
            room_size: joi_1.default.string().allow(" ", null).optional(),
            occupancy: joi_1.default.number().allow(" ", null).optional(),
            bed_type: joi_1.default.string().allow(" ", null).optional(),
            rate_per_night: joi_1.default.number().optional(),
            availability: joi_1.default.number().optional(),
            discount_percent: joi_1.default.number().allow(" ", null).optional(),
            description: joi_1.default.string().allow(" ", null).optional(),
            refundable: joi_1.default.number().default(1),
            discount: joi_1.default.number().allow(" ", null).optional(),
            refundable_time: joi_1.default.number().allow(" ", null).optional(),
            refundable_charge: joi_1.default.number().allow(" ", null).optional(),
            aminities_charge: joi_1.default.number().allow("", null).optional(),
            room_aminities: joi_1.default.string().custom((value, helpers) => {
                try {
                    const parsedArray = JSON.parse(value);
                    if (!Array.isArray(parsedArray)) {
                        return helpers.message({
                            custom: "invalid room_aminities, should be a JSON array",
                        });
                    }
                    for (const item of parsedArray) {
                        if (typeof item !== "object" || Array.isArray(item)) {
                            return helpers.message({
                                custom: "invalid room_aminities array item type, should be objects",
                            });
                        }
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid room_aminities, should be a valid JSON array",
                    });
                }
            }).optional(),
        });
    }
}
exports.default = RroomValidator;
//# sourceMappingURL=mRoom.validator.js.map