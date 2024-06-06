import Joi from "joi";

class CommonValidator {
  // single param validator
  public singleParamValidator = (idFieldName: string = "id") => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.number().required();
    return Joi.object(schemaObject);
  };

  // single param string validator
  public singleParamStringValidator = (idFieldName: string = "id") => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.string().required();
    return Joi.object(schemaObject);
  };

  // change password validator
  public changePasswordValidator = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
  });

  // forget password validator
  public forgetPasswordValidator = Joi.object({
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });

  // send email otp validator
  public sendEmailOtpValidator = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string()
      .valid("forget_h_admin", "forget_m_admin", "forget_h_user","forget_r_admin" )
      .required(),
  });

  // match email otp validator
  public matchEmailOtpValidator = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    type: Joi.string()
      .valid("forget_h_admin", "forget_m_admin", "forget_h_user", "forget_r_admin")
      .required(),
  });

  // login validator
  public loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
}

export default CommonValidator;
