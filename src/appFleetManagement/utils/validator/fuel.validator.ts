import Joi from "joi";

class FuelValidator {
    // create Fuel Refill
    public createFuelValidator = Joi.object({
        vehicle_id: Joi.number().required(),
        filling_station_name: Joi.string().required(),
        fuel_quantity: Joi.number().required(),
        per_quantity_amount: Joi.number().required(),
        refilled_by: Joi.string().allow("").optional(),
        refilled_date: Joi.date().required(),
    });

    // get all Fuel Refill Details
    public getAllFuelValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional()
    });

}
export default FuelValidator;