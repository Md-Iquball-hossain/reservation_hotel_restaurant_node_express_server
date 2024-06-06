import Joi from "joi";
class RoomValidator {
  // create room validator
  createRoomValidator = Joi.object({
    room_number: Joi.string().required(),
    room_type: Joi.string().allow("").required(),
    room_size: Joi.string().allow("").optional(),
    occupancy: Joi.number().allow("").optional(),
    bed_type: Joi.string().allow("").required(),
    rate_per_night: Joi.number().required(),
    availability: Joi.number().optional(),
    discount_percent: Joi.number().allow("").optional(),
    tax_percent: Joi.number().allow("").optional(),
    description: Joi.string().allow("").optional(),
    refundable: Joi.number().default(1),
    discount: Joi.number().allow("").optional(),
    refundable_time: Joi.number().allow("").optional(),
    refundable_charge: Joi.number().allow("").optional(),
    aminities_charge: Joi.number().allow("").optional(),
    child: Joi.number().allow("").optional(),
    adult: Joi.number().allow("").required(),
    room_amenities: Joi.string()
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
      } catch (err) {
      return helpers.message({
        custom: "invalid room_aminities, should be a valid JSON Object",
      });
      }
    })
    .optional(),
  });

  // get all hotel room validator
  public getAllHotelRoomQueryValidator = Joi.object({
    key: Joi.string().allow("").optional(),
    availability: Joi.string().allow("").optional(),
    refundable: Joi.string().allow("").optional(),
    occupancy: Joi.string().allow("").optional(),
    child: Joi.number().allow("").optional(),
    adult: Joi.number().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
  });

  // update hotel room validator
  public updateHotelRoomValidator = Joi.object({
    room_number: Joi.string().optional(),
    room_type: Joi.string().allow("").optional(),
    room_size: Joi.string().allow("").optional(),
    occupancy: Joi.number().allow("").optional(),
    bed_type: Joi.string().allow("").optional(),
    rate_per_night: Joi.number().optional(),
    room_view: Joi.string().allow("").optional(),
    availability: Joi.number().optional(),
    discount_percent: Joi.number().allow("").optional(),
    tax_percent: Joi.number().allow("").optional(),
    description: Joi.string().allow("").optional(),
    refundable: Joi.number().default(1),
    discount: Joi.number().allow("").optional(),
    refundable_time: Joi.number().allow("").optional(),
    refundable_charge: Joi.number().allow("").optional(),
    aminities_charge: Joi.number().allow("").optional(),
    child: Joi.number().optional(),
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
        } catch (err) {
          return helpers.message({
            custom:
              "invalid remove_photos, remove_photos will be json array of number",
          });
        }
      })
      .optional(),
    adult: Joi.number().optional(),
    room_amenities: Joi.string()
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
        } catch (err) {
          return helpers.message({
            custom: "invalid room_aminities, should be a valid JSON Object",
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
  });
}
export default RoomValidator;
