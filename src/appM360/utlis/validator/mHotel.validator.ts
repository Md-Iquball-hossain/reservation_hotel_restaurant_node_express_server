import Joi from "joi";

class MHotelValidator {
  // create hotel input validator
  public createHotelValidator = Joi.object({
    hotel_name: Joi.string().required(),
    hotel_email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .regex(/^\S/)
      .required(),
    city: Joi.string().lowercase().trim().regex(/^\S/).required(),
    country: Joi.string().lowercase().trim().regex(/^\S/).required(),
    expiry_date: Joi.date().required(),
    group: Joi.string().lowercase().trim().regex(/^\S/).optional(),
    user_name: Joi.string().lowercase().trim().regex(/^\S/).required(),
    user_email: Joi.string().email().lowercase().trim().regex(/^\S/).required(),
    password: Joi.string().trim().regex(/^\S/).required(),
    permission: Joi.string().lowercase().required(),
  });

  // update hotel input validator
  public updateHotelValidator = Joi.object({
    name: Joi.string().optional(),
    expiry_date: Joi.date().optional(),
  });

  // get all hotel validator
  public getAllHotelValidator = Joi.object({
    name: Joi.string().optional(),
    group: Joi.string().optional(),
    city: Joi.string().optional(),
    status: Joi.string()
      .valid("active", "inactive", "blocked", "expired")
      .optional(),
    from_date: Joi.date().optional(),
    to_date: Joi.date().optional(),
  });
}

export default MHotelValidator;
