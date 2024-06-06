import Joi from "joi";

class GuestValidator {
    // create guest validator
    public createGuestValidator = Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
            .email()
            .lowercase()
            .trim()
            .regex(/^\S/)
            .required(),
        city: Joi.string().lowercase().trim().regex(/^\S/).optional(),
        phone:  Joi.number().allow("").optional(),
        country: Joi.string().lowercase().trim().regex(/^\S/).optional(),
        address:Joi.string().allow("").optional(),
        zip_code:  Joi.number().allow("").optional(),
        postal_code:  Joi.number().allow("").optional(),
        user_type: Joi.string().valid('guest', 'user', 'hall-guest', 'room-guest').optional(),
    });

    // get all guest list validator
    public getAllGuestValidator = Joi.object({
        key: Joi.string().allow("").optional(),
        email: Joi.string().allow("").optional(),
        user_type: Joi.string().allow("").optional(),
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
    });

    // get all guest list validator
    public getHallGuestValidator = Joi.object({
        // id: Joi.number().allow("").optional(),
    });

}
export default GuestValidator;
