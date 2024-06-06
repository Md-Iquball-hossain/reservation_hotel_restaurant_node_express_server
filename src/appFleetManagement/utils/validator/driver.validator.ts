import Joi from "joi";

class DriverValidator {
    // create Driver
    public createDriverValidator = Joi.object({
        name: Joi.string().required(),
        email:Joi.string()
        .email()
        .lowercase()
        .trim()
        .regex(/^\S/)
        .optional(),
        phone: Joi.number().required(),
        address: Joi.string().required(),
        photo: Joi.string().allow("").optional(),
        blood_group: Joi.string().lowercase().
        valid('a+', 'b+', 'ab+', 'a-', 'b-', 'ab-', 'o+', 'o-'),
        date_of_birth: Joi.date().required(),
        licence_number : Joi.string().required(),
        licence_photo : Joi.string().allow("").optional(),
        license_class: Joi.string().valid('motorcycle', 'light-motor-vehicle', 
        'heavy-motor-vehicle', 'three-wheeler', 'invalid-carriage', 'tractor',
        'ambulance', 'fire-truck') ,
        expiry_date: Joi.date().required(),
        year_of_experience: Joi.number().allow("").optional(),
        emr_contact_name: Joi.string().allow("").optional(),
        emr_contact_number: Joi.number().allow("").optional(),
    });

    // get all Driver
    public getAllDriverValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        status: Joi.string().allow("").optional(),
    });

    // update Driver
    public updateDriverValidator = Joi.object({
        name: Joi.string().optional(),
        email:Joi.string()
        .email()
        .lowercase()
        .trim()
        .regex(/^\S/)
        .optional(),
        phone: Joi.number().optional(),
        address: Joi.string().optional(),
        photo: Joi.string().allow("").optional(),
        blood_group: Joi.string().lowercase().
        valid('a+', 'b+', 'ab+', 'a-', 'b-', 'ab-', 'o+', 'o-'),
        date_of_birth: Joi.date().required(),
        licence_number : Joi.string().optional(),
        licence_photo : Joi.string().allow("").optional(),
        license_class: Joi.string().valid('motorcycle', 'light-motor-vehicle', 
        'heavy-motor-vehicle', 'three-wheeler', 'invalid-carriage', 'tractor', 
        'ambulance', 'fire-truck') ,
        expiry_date: Joi.date().optional(),
        year_of_experience: Joi.number().allow("").optional(),
        emr_contact_name: Joi.string().allow("").optional(),
        emr_contact_number: Joi.number().allow("").optional(),
        status: Joi.number().valid(0,1)
    });

}
export default DriverValidator;