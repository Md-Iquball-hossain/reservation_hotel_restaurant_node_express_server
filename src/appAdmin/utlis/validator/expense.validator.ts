import Joi from "joi";

class ExpenseValidator {
  // create expense head validator
  createExpenseHeadValidator = Joi.object({
    name: Joi.string().required(),
  });

  //update expense head validator
  UpdateExpenseHeadValidator = Joi.object({
    name: Joi.string().required(),
  });

  // create expense validator
  createExpenseValidator = Joi.object({
    name: Joi.string().required(),
    ac_tr_ac_id: Joi.number().required(),
    expense_date: Joi.date().required(),
    remarks: Joi.string().allow("").optional(),
    expense_item: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          amount: Joi.number().required(),
        })
      )
      .required(),
  });

  // get all room booking query validator
  public getAllExpenseQueryValidator = Joi.object({
    limit: Joi.string().optional(),
    skip: Joi.string().optional(),
    key: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
  });
}
export default ExpenseValidator;
