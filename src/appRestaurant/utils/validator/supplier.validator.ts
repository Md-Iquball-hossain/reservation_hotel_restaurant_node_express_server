import Joi from "joi";

class SupplierValidator {

// create Supplier validation
public createSupplierValidatorValidator = Joi.object({
    name: Joi.string().uppercase().allow("").required(),
    phone: Joi.number().allow("").required(),
});

// get all Supplier query validator
public getAllSupplierQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    status: Joi.string().allow("").optional(),
});

// update Supplier validation
public UpdateSupplierValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    phone: Joi.number().allow("").optional(),
    status: Joi.number().allow("").optional(),
});

}
export default SupplierValidator;