import Joi from "joi";

class HoteUserAuthValidator {

  // profile registartion validator
  public registrationValidator = Joi.object({
    hotel_id: Joi.number().optional(),
    name: Joi.string().allow("").required(),
    email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .regex(/^\S/)
    .required(),
    city: Joi.string().lowercase().trim().regex(/^\S/).optional(),
    photo: Joi.string().allow("").optional(),
    country: Joi.string().lowercase().trim().regex(/^\S/).optional(),
    address: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    zip_code: Joi.string().allow("").optional(),
    postal_code: Joi.string().allow("").optional(),
    password: Joi.string().allow("").required(),
  });

  // update profile validator
  public updateProfileValidator = Joi.object({
    hotel_id: Joi.number().optional(),
    email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .regex(/^\S/)
    .required(),
    name: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    nid_no: Joi.string().allow("").optional(),
    passport_no:Joi.string().allow("").optional(),
    photo: Joi.string().allow("").optional(),
    city: Joi.string().lowercase().trim().regex(/^\S/).optional(),
    address: Joi.string().allow("").optional(),
    zip_code: Joi.string().allow("").optional(),
    postal_code: Joi.string().allow("").optional(),
    country: Joi.string().lowercase().trim().regex(/^\S/).optional(),

  });

}
export default HoteUserAuthValidator;
