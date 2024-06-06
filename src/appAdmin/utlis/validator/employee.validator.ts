import Joi from "joi";
class EmployeeValidator {
  // create employee validator
  createEmployeeValidator = Joi.object({
    name: Joi.string().allow("").required(),
    department_id: Joi.number().required(),
    designation_id: Joi.number().required(),
    res_id: Joi.number().allow("").optional(),
    category: Joi.string()
    .valid("restaurant", "hotel", "management")
    .optional(),
    blood_group: Joi.string()
      .valid("a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-")
      .optional(),
    salary: Joi.number().optional(),
    email: Joi.string().allow("").optional(),
    mobile_no: Joi.string().allow("").required(),
    birth_date: Joi.string().optional(),
    appointment_date: Joi.string().optional(),
    joining_date: Joi.string().optional(),
    address: Joi.string().allow("").optional(),
  });

  // get all Employee query validator
  getAllEmployeeQueryValidator = Joi.object({
    status: Joi.string().valid("0", "1"),
    category: Joi.string().allow("").optional(),
    key: Joi.string().allow("").optional(),
    limit: Joi.string().allow("").optional(),
    skip: Joi.string().allow("").optional(),
  });

  // update employee validator
  updateEmployeeValidator = Joi.object({
    name: Joi.string().allow("").optional(),
    department_id: Joi.number().optional(),
    res_id: Joi.number().allow("").optional(),
    designation_id: Joi.number().optional(),
    blood_group: Joi.string()
      .valid("a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-")
      .optional(),
    salary: Joi.number().optional(),
    status: Joi.number().optional(),
    mobile_no: Joi.string().allow("").optional(),
    birth_date: Joi.string().optional(),
    appointment_date: Joi.string().optional(),
    category: Joi.string()
    .valid("restaurant", "hotel", "management")
    .optional(),
    joining_date: Joi.string().optional(),
    address: Joi.string().allow("").optional(),
  });
}
export default EmployeeValidator;
