import Joi from "joi";

class MoneyRecieptValidator {
  // create money reciept
  public createMoneyReciept = Joi.object({
    ac_tr_ac_id: Joi.number().required(),
    user_id: Joi.number().required(),
    paid_amount: Joi.number().required(),
    reciept_type: Joi.string().valid("invoice", "overall").required(),
    invoice_id: Joi.number().optional(),
    remarks: Joi.string().required(),
  });

  // get all money reciept validator
  public getAllMoneyReciept = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
  });

  // advance return money reciept
  public advanceReturnMoneyReciept = Joi.object({
    ac_tr_ac_id: Joi.number().required(),
    user_id: Joi.number().required(),
    return_amount: Joi.number().required(),
    return_date: Joi.string().required(),
    remarks: Joi.string().required(),
  });

  // get all advance money reciept validator
  public getAllAdvanceMoneyReciept = Joi.object({
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
  });

}
export default MoneyRecieptValidator;
