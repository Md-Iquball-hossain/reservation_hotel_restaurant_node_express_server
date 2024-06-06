import Joi from "joi";

class DashBoardValidator {

    // Account Report Validator
    public getAllAmountQueryValidator = Joi.object({
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional(),
    });

    // Account Report Validator
    public getAllAccountQueryValidator = Joi.object({
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional(),
        ac_type: Joi.string().allow("").required(),
    });

    // Room Report Validator
    public getAllRoomsQueryValidator = Joi.object({
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional(),
    });

}
export default DashBoardValidator;