import Joi from "joi";

class RestaurantValidator {

    // create Restaurant validation
    public updateRestaurantValidator = Joi.object({
        name: Joi.string().optional(),
        phone: Joi.number().optional(),
        photo: Joi.string().optional(),
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        country: Joi.string().optional(),
        bin_no: Joi.string().optional(),
    });

    // create Restaurant Admin validation
    public updateRestaurantAdminValidator = Joi.object({
        name: Joi.string().allow().optional(),
        avatar: Joi.string().allow().optional(),
        phone: Joi.number().allow().optional(),
        status: Joi.valid("active","inactive").optional()
    });

}
export default RestaurantValidator;