import Joi from "joi";

class InventoryValidator {

    // get all Inventory validator
    public getAllInventoryValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
    });

}
export default InventoryValidator;