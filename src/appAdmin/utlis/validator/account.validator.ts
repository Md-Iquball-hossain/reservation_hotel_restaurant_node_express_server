import Joi from "joi";
class AccountValidator {
  // create account validator
  createAccountValidator = Joi.object({
    name: Joi.string().allow("").required(),
    ac_type: Joi.string()
      .lowercase()
      .valid("bank", "cash", "cheque", "mobile-banking")
      .required(),
    bank: Joi.string().allow("").optional(),
    branch: Joi.string().allow("").optional(),
    account_number: Joi.string().allow("").required(),
    opening_balance: Joi.number().optional(),
    details: Joi.string().allow("").optional(),
  });

  // get all account query validator
  getAllAccountQueryValidator = Joi.object({
    status: Joi.string().valid("0", "1"),
    ac_type: Joi.string()
      .lowercase()
      .valid("bank", "cash", "cheque", "mobile-banking")
      .optional(),
    key: Joi.string().allow("").optional(),
    admin_id: Joi.number().allow("").optional(),
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
  });

  // update account validator
  updateAccountValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    ac_type: Joi.string()
      .lowercase()
      .valid("bank", "cash", "cheque", "mobile-banking")
      .required(),
    bank: Joi.string().allow("").optional(),
    branch: Joi.string().allow("").optional(),
    account_number: Joi.string().allow("").optional(),
    opening_balance: Joi.number().optional(),
    details: Joi.string().allow("").optional(),
    status: Joi.number().optional(),
  });

  // balance transfer
  balanceTransferValidator = Joi.object({
    transfer_type: Joi.string()
      .lowercase()
      .valid("by_account", "overall")
      .required(),
    from_account: Joi.number().optional(),
    to_account: Joi.number().optional(),
    pay_amount: Joi.number().optional(),
  });
}
export default AccountValidator;
