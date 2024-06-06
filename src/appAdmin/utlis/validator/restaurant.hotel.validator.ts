import Joi from "joi";

class HotelRestaurantValidator {
  // create hotel Restaurant validation
  public createRestaurantValidator = Joi.object({
    name: Joi.string().required(),
    res_email: Joi.string().email().lowercase().trim().regex(/^\S/).required(),
    phone: Joi.number().optional(),
    admin_name: Joi.string().required(),
    email: Joi.string().email().lowercase().trim().regex(/^\S/).required(),
    bin_no: Joi.number().optional(),
    address: Joi.string().optional(),
    password: Joi.string().min(8).required(),
    permission: Joi.array().items(Joi.number().required()).required(),
  });

  // update hotel restaurant validation
  public updateHotelRestaurantValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    status: Joi.string().valid("0", "1"),
  });

  // get all Restaurant query validator
  public getAllRestaurantQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
  });
}
export default HotelRestaurantValidator;
