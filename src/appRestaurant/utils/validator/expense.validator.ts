import Joi from "joi";

class ExpenseResValidator {
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
    name: Joi.string().optional(),
    ac_tr_ac_id: Joi.number().required(),
    expense_date: Joi.date().optional(),
    expense_category: Joi.string().valid("office", "food", "fixed").optional(),
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
    expense_category: Joi.string().allow("").optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
  });
}
export default ExpenseResValidator;
