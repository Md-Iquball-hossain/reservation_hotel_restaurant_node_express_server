import Joi from "joi";

class MAuthValidator {
  // update profile validator
  public updateProfileValidator = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().allow("").optional(),
  });
}

export default MAuthValidator;
