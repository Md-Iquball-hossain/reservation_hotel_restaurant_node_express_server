import Joi from "joi";

class ResReportValidator {

// get Supplier Report validator
public getSupplierReportValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
    supplier_id: Joi.string().allow("").optional(),
    ac_tr_ac_id: Joi.string().allow("").optional(),
});

// get Purchase Report validator
public getPurchaseReportValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
});

// get Purchase Report validator
public getFoodCategoryReportValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
    food_name: Joi.string().allow("").optional(),
    category_name: Joi.string().allow("").optional(),
});

// get Sales Report validator
public getSalesReportValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
});

// get Sales Report validator
public getExpenseReportValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
});


}
export default ResReportValidator;