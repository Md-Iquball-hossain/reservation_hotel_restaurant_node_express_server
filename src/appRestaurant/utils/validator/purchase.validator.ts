import Joi from "joi";

class PurchaseValidator {
  // create Purchase validation
  public createPurchaseValidator = Joi.object({
    purchase_date: Joi.string().allow("").required(),
    supplier_id: Joi.number().allow("").required(),
    ac_tr_ac_id: Joi.number().allow("").optional(),
    discount_amount: Joi.number().allow("").optional(),
    purchase_items: Joi.array()
      .items(
        Joi.object({
          ingredient_id: Joi.number().required(),
          name: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
        })
      )
      .required(),
  });

  // get all Purchase query validator
  public getAllPurchaseQueryValidator = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
  });

  // get all account query validator
  public getAllAccountQueryValidator = Joi.object({
    status: Joi.string().valid("0", "1"),
    ac_type: Joi.string()
      .lowercase()
      .valid("bank", "cash", "cheque", "mobile-banking")
      .optional(),
    key: Joi.string().allow("").optional(),
  });
}
export default PurchaseValidator;
