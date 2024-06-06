import Joi from "joi";

class CategoryValidator {

// create Category validation
public createCategoryValidatorValidator = Joi.object({
    name: Joi.string().uppercase().allow("").required(),
});

// get all Category query validator
public getAllCategoryQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    status: Joi.string().allow("").optional(),
});

// update Category validation
public UpdateCategoryValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    phone: Joi.number().allow("").optional(),
    status: Joi.number().allow("").optional(),
});

}
export default CategoryValidator;