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
        // get all hall validator
        this.getAvailableHallQueryValidator = joi_1.default.object({
            start_time: joi_1.default.string().allow("").optional(),
            end_time: joi_1.default.string().allow("").optional(),
            event_date: joi_1.default.string().allow("").optional(),
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
// import Joi from "joi";
// class HallValidator {
//     // create Hall validator
//     createHallValidator = Joi.object({
//     name: Joi.string().allow("").required(),
//     capacity: Joi.string().allow("").required(),
//     rate_per_hour: Joi.number().required(),
//     size: Joi.number().optional(),
//     location: Joi.string().allow("").required(),
//     hall_amenities: Joi.string()
//     .custom((value, helpers) => {
//     try {
//         const parsedObject = JSON.parse(value);
//         const hallAminitesType = typeof parsedObject;
//         if (hallAminitesType !== "object") {
//         return helpers.message({
//             custom: "invalid hall_amenities, should be a JSON object",
//         });
//         }
//         return value;
//     } catch (err) {
//         return helpers.message({
//         custom: "invalid hall_amenities, should be a valid JSON Object",
//         });
//     }
//     })
//     .optional(),
// });
//     // get all hall validator
//     public getAllHotelHallQueryValidator = Joi.object({
//         key: Joi.string().allow("").optional(),
//         hall_status:Joi.string().allow("").optional(),
//         limit: Joi.string().allow("").optional(),
//         skip: Joi.string().allow("").optional(),
//     });
//     // get all hall validator
//     public getAvailableHallQueryValidator = Joi.object({
//         start_time: Joi.string().allow("").optional(),
//         end_time: Joi.string().allow("").optional(),
//         event_date: Joi.string().allow("").optional(),
//         limit: Joi.string().allow("").optional(),
//         skip: Joi.string().allow("").optional(),
//     });
//     // update hall validator
//     public updateHotelHallValidator = Joi.object({
//     name: Joi.string().allow("").optional(),
//     capacity: Joi.string().allow("").optional(),
//     size: Joi.number().optional(),
//     rate_per_hour: Joi.number().optional(),
//     location: Joi.string().allow("").optional(),
//     hall_status: Joi.string().valid("available", "booked","maintenance").optional(),
//     hall_amenities: Joi.string()
//         .custom((value, helpers) => {
//         try {
//             const parsedObject = JSON.parse(value);
//             const hallAminitesType = typeof parsedObject;
//             if (hallAminitesType !== "object") {
//             return helpers.message({
//                 custom: "invalid hall_amenities, should be a JSON object",
//             });
//             }
//             return value;
//     } catch (err) {
//             return helpers.message({
//             custom: "invalid hall_amenities, should be a valid JSON Object",
//             });
//         }
//         })
//         .optional(),
//     remove_photos: Joi.string()
//         .custom((value, helpers) => {
//         try {
//             const parsedArray = JSON.parse(value);
//             if (!Array.isArray(parsedArray)) {
//             return helpers.message({
//                 custom:
//                 "invalid remove_photos, remove_photos will be json array of number",
//             });
//             }
//             for (const item of parsedArray) {
//             if (typeof item !== "number") {
//                 return helpers.message({
//                 custom:
//                     "invalid remove_photos array item type, item type will be number",
//                 });
//             }
//             }
//             return value;
//     }   catch (err) {
//             return helpers.message({
//             custom:
//                 "invalid remove_photos, remove_photos will be json array of number",
//             });
//         }
//         })
//         .optional(),
//     remove_amenities: Joi.string()
//         .custom((value, helpers) => {
//         try {
//             const parsedArray = JSON.parse(value);
//             if (!Array.isArray(parsedArray)) {
//             return helpers.message({
//                 custom:
//                 "invalid remove_amenities, remove_amnities will be json array of number",
//             });
//             }
//             for (const item of parsedArray) {
//             if (typeof item !== "number") {
//                 return helpers.message({
//                 custom:
//                     "invalid remove_amenities array item type, item type will be number",
//                 });
//             }
//             }
//             return value;
//         } catch (err) {
//             return helpers.message({
//             custom:
//                 "invalid remove_amenities, remove_amenities will be json array of number",
//             });
//         }
//         })
//         .optional(),
//     });
// }
// export default HallValidator;
//# sourceMappingURL=hall.validation.js.map