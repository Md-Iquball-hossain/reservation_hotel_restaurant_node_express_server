"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class HallValidator {
    constructor() {
        // create Hall validator
        this.createHallValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            capacity: joi_1.default.string().allow("").required(),
            rate_per_hour: joi_1.default.number().required(),
            size: joi_1.default.number().optional(),
            location: joi_1.default.string().allow("").required(),
            hall_amenities: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const hallAminitesType = typeof parsedObject;
                    if (hallAminitesType !== "object") {
                        return helpers.message({
                            custom: "invalid hall_amenities, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid hall_amenities, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
        });
        // get all hall validator
        this.getAllHotelHallQueryValidator = joi_1.default.object({
            key: joi_1.default.string().allow("").optional(),
            hall_status: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
        // update hall validator
        this.updateHotelHallValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            capacity: joi_1.default.string().allow("").optional(),
            size: joi_1.default.number().optional(),
            rate_per_hour: joi_1.default.number().optional(),
            location: joi_1.default.string().allow("").optional(),
            hall_status: joi_1.default.string().valid("available", "booked", "maintenance").optional(),
            hall_amenities: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const hallAminitesType = typeof parsedObject;
                    if (hallAminitesType !== "object") {
                        return helpers.message({
                            custom: "invalid hall_amenities, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid hall_amenities, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
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
            remove_amenities: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedArray = JSON.parse(value);
                    if (!Array.isArray(parsedArray)) {
                        return helpers.message({
                            custom: "invalid remove_amenities, remove_amnities will be json array of number",
                        });
                    }
                    for (const item of parsedArray) {
                        if (typeof item !== "number") {
                            return helpers.message({
                                custom: "invalid remove_amenities array item type, item type will be number",
                            });
                        }
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid remove_amenities, remove_amenities will be json array of number",
                    });
                }
            })
                .optional(),
        });
    }
}
exports.default = HallValidator;
//# sourceMappingURL=hall.validation.js.map