import Joi from "joi";

class HotelValidator {
  // update hotel input validator
  public updateHotelValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    email: Joi.string()
      .email()
      .allow(" ")
      .lowercase()
      .trim()
      .regex(/^\S/)
      .optional(),
    city: Joi.string().lowercase().trim().allow("").regex(/^\S/).optional(),
    country: Joi.string().lowercase().trim().allow("").regex(/^\S/).optional(),
    group: Joi.string().lowercase().trim().allow("").regex(/^\S/).optional(),
    address: Joi.string().lowercase().trim().allow("").regex(/^\S/).optional(),
    phone: Joi.string().lowercase().trim().allow("").regex(/^\S/).optional(),
    map_url: Joi.string().lowercase().trim().allow("").regex(/^\S/).optional(),
    website: Joi.string().lowercase().trim().allow("").regex(/^\S/).optional(),
    description: Joi.string()
      .lowercase()
      .trim()
      .allow("")
      .regex(/^\S/)
      .optional(),
    founded_year: Joi.date().optional(),
    zip_code: Joi.string().trim().allow("").regex(/^\S/).optional(),
    postal_code: Joi.string()
      .lowercase()
      .trim()
      .allow("")
      .regex(/^\S/)
      .optional(),
    hotel_amnities: Joi.string()
      .custom((value, helpers) => {
        try {
          const parsedArray = JSON.parse(value);

          if (!Array.isArray(parsedArray)) {
            return helpers.message({
              custom:
                "invalid hotel_amnities, hotel_amnities will be json array of string",
            });
          }

          for (const item of parsedArray) {
            if (typeof item !== "string") {
              return helpers.message({
                custom:
                  "invalid hotel_amnities array item type, item type will be string",
              });
            }
          }

          return value;
        } catch (err) {
          return helpers.message({
            custom:
              "invalid hotel_amnities, hotel_amnities will be json array of string",
          });
        }
      })
      .optional(),
    remove_amnities: Joi.string()
      .custom((value, helpers) => {
        try {
          const parsedArray = JSON.parse(value);

          if (!Array.isArray(parsedArray)) {
            return helpers.message({
              custom:
                "invalid remove_amnities, remove_amnities will be json array of number",
            });
          }

          for (const item of parsedArray) {
            if (typeof item !== "number") {
              return helpers.message({
                custom:
                  "invalid remove_amnities array item type, item type will be number",
              });
            }
          }

          return value;
        } catch (err) {
          return helpers.message({
            custom:
              "invalid remove_amnities, remove_amnities will be json array of number",
          });
        }
      })
      .optional(),
    remove_photo: Joi.string()
      .custom((value, helpers) => {
        try {
          const parsedArray = JSON.parse(value);

          if (!Array.isArray(parsedArray)) {
            return helpers.message({
              custom:
                "invalid remove_photo, remove_photo will be json array of number",
            });
          }

          for (const item of parsedArray) {
            if (typeof item !== "number") {
              return helpers.message({
                custom:
                  "invalid remove_photo array item type, item type will be number",
              });
            }
          }

          return value;
        } catch (err) {
          return helpers.message({
            custom:
              "invalid remove_photo, remove_photo will be json array of number",
          });
        }
      })

      .optional(),
  });
}

export default HotelValidator;
