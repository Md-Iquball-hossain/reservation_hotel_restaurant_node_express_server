import Joi from "joi";

class ownersValidator {
    // create owners
    public createOwnerValidator = Joi.object({
        name: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().allow("").optional(),
        address: Joi.string().allow("").optional(),
        occupation: Joi.string().allow("").optional(),
        photo: Joi.string().allow("").optional(),
        documents: Joi.string().allow("").optional(),
    });

    // get all owner
    public getAllOwnerValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        status: Joi.number().allow("").optional(),
    });

    // update owners
    public updateOwnerValidator = Joi.object({
        name: Joi.string().allow("").optional(),
        email: Joi.string().allow("").optional(),
        phone: Joi.number().allow("").optional(),
        address: Joi.string().allow("").required(),
        occupation: Joi.string().allow("").optional(),
        photo: Joi.string().allow("").optional(),
        documents: Joi.string().allow("").optional(),
        status: Joi.number().valid(0,1)
    });

}
export default ownersValidator;