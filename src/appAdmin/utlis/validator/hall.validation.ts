import Joi from "joi";

class HallValidator {
    // create Hall validator
    createHallValidator = Joi.object({
    name: Joi.string().allow("").required(),
    capacity: Joi.string().allow("").required(),
    rate_per_hour: Joi.number().required(),
    size: Joi.number().optional(),
    location: Joi.string().allow("").required(),
    hall_amenities: Joi.string()
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
    } catch (err) {
        return helpers.message({
        custom: "invalid hall_amenities, should be a valid JSON Object",
        });
    }
    })
    .optional(),
});

    // get all hall validator
    public getAllHotelHallQueryValidator = Joi.object({
        key: Joi.string().allow("").optional(),
        hall_status:Joi.string().allow("").optional(),
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
    });

    // get all hall validator
    public getAvailableHallQueryValidator = Joi.object({
        start_time: Joi.string().allow("").optional(),
        end_time: Joi.string().allow("").optional(),
        event_date: Joi.string().allow("").optional(),
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
    });

    // update hall validator
    public updateHotelHallValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    capacity: Joi.string().allow("").optional(),
    size: Joi.number().optional(),
    rate_per_hour: Joi.number().optional(),
    location: Joi.string().allow("").optional(),
    hall_status: Joi.string().valid("available", "booked","maintenance").optional(),
    hall_amenities: Joi.string()
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
    } catch (err) {
            return helpers.message({
            custom: "invalid hall_amenities, should be a valid JSON Object",
            });
        }
        })
        .optional(),
    remove_photos: Joi.string()
        .custom((value, helpers) => {
        try {
            const parsedArray = JSON.parse(value);

            if (!Array.isArray(parsedArray)) {
            return helpers.message({
                custom:
                "invalid remove_photos, remove_photos will be json array of number",
            });
            }

            for (const item of parsedArray) {
            if (typeof item !== "number") {
                return helpers.message({
                custom:
                    "invalid remove_photos array item type, item type will be number",
                });
            }
            }

            return value;
    }   catch (err) {
            return helpers.message({
            custom:
                "invalid remove_photos, remove_photos will be json array of number",
            });
        }
        })
        .optional(),
    remove_amenities: Joi.string()
        .custom((value, helpers) => {
        try {
            const parsedArray = JSON.parse(value);

            if (!Array.isArray(parsedArray)) {
            return helpers.message({
                custom:
                "invalid remove_amenities, remove_amnities will be json array of number",
            });
            }

            for (const item of parsedArray) {
            if (typeof item !== "number") {
                return helpers.message({
                custom:
                    "invalid remove_amenities array item type, item type will be number",
                });
            }
            }

            return value;
        } catch (err) {
            return helpers.message({
            custom:
                "invalid remove_amenities, remove_amenities will be json array of number",
            });
        }
        })
        .optional(),
    });

}
export default HallValidator;


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
