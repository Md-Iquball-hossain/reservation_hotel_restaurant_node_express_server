import Joi from "joi";

class FoodValidator {
  // create Food validation
  public createFoodValidator = Joi.object({
    name: Joi.string().required(),
    category_id: Joi.number().required(),
    production_price: Joi.number().optional(),
    retail_price: Joi.number().required(),
    food_items: Joi.array()
      .items(
        Joi.object({
          ingredient_id: Joi.number().required(),
          ing_quantity: Joi.number().required(),
        })
      )
      .required(),
  });

  // get all Food query validator
  public getAllFoodQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
    category: Joi.string().allow("").optional(),
  });

  // update Food validation
  public updateFoodValidator = Joi.object({
    name: Joi.string().allow("").required(),
    category_id: Joi.number().allow("").required(),
    inc_quantity: Joi.number().allow("").optional(),
    dec_quantity: Joi.number().allow("").optional(),
    ava_quantity: Joi.number().allow("").optional(),
    retail_price: Joi.number().allow("").optional(),
    status: Joi.number().allow("").optional(),
  });
}
export default FoodValidator;
