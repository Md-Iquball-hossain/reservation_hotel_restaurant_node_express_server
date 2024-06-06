    import Joi from "joi";

    class IngredientValidator {

    // create Ingredient validation
    public createIngredientValidator = Joi.object({
        name: Joi.string().uppercase().allow("").required(),
        measurement: Joi.string().uppercase().allow("").required(),
    });

    // get all Ingredient query validator
    public getAllIngredientQueryValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        name: Joi.string().allow("").optional(),
    });

    // update Ingredient validation
    public UpdateIngredientValidator = Joi.object({
        name: Joi.string().allow("").optional(),
        measurement: Joi.string().uppercase().allow("").required(),
    });

    // create Ingredient item validation
    public createIngredientItemValidator = Joi.object({
        ingredient_id: Joi.string().allow("").required(),
        quantity: Joi.number().allow("").required(),
        price: Joi.number().allow("").required(),
        total: Joi.number().allow("").required(),
    });

    }
    export default IngredientValidator;
