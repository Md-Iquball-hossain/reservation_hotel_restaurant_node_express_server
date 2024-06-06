import Joi from 'joi';
    class PayRollValidator {

    public CreatePayrollValidator = Joi.object({
        employee_id: Joi.number().required(),
        ac_tr_ac_id: Joi.number().required(),
        attendance_days: Joi.number().optional(),
        advance_salary: Joi.number().optional(),
        working_hours: Joi.number().optional(),
        provident_fund: Joi.number().optional(),
        mobile_bill: Joi.number().optional(),
        feed_allowance: Joi.number().optional(),
        perform_bonus: Joi.number().optional(),
        festival_bonus: Joi.string().allow("").optional(),
        travel_allowance: Joi.string().allow("").optional(),
        health_allowance: Joi.string().allow("").optional(),
        incentive: Joi.string().allow("").optional(),
        house_rent: Joi.string().allow("").optional(),
        salary_date: Joi.string().required(),
        gross_salary: Joi.number().required(),
        total_salary: Joi.number().required(),
        docs: Joi.string().allow("").optional(),
        note: Joi.string().allow("").optional(),
        deductions: Joi.string()
            .custom((value, helpers) => {
            try {
            const parsedObject = JSON.parse(value);
            const deductionType = typeof parsedObject;
            if (deductionType !== "object") {
                return helpers.message({
                custom: "invalid deductions, should be a JSON object",
            });}
            return value;
            } catch (err) {
            return helpers.message({
                custom: "invalid deductions, should be a valid JSON Object",
            });
            }
            })
            .optional(),
        others: Joi.string()
            .custom((value, helpers) => {
            try {
            const parsedObject = JSON.parse(value);
            const otherType = typeof parsedObject;
            if (otherType !== "object") {
                return helpers.message({
                custom: "invalid others, should be a JSON object",
            });}
            return value;
            } catch (err) {
            return helpers.message({
                custom: "invalid others, should be a valid JSON Object",
            });
            }
            })
            .optional(),
        });

    // get all Pay Roll query validator
    public getAllPayRollValidator = Joi.object({

        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional(),
    });

    // Params id Validator
    public PayrollidValidator= Joi.object({
        id: Joi.number().required(),
    });

}
export default PayRollValidator;
