import Joi from "joi";

class HotelAdminAuthValidator {
  // update profile validator
  public updateProfileValidator = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().allow("").optional(),
  });
}

export default HotelAdminAuthValidator;
