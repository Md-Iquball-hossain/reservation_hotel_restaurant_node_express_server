import Joi from "joi";

class TripValidator {
    // create Trip
    public createTripValidator = Joi.object({
        vehicle_id: Joi.number().required(),
        driver_id: Joi.number().required(),
        start_location: Joi.string().required(),
        end_location: Joi.string().required(),
        trip_start: Joi.date().required(),
        trip_end: Joi.date().required(),
        distance: Joi.number().allow("").optional(),
        fuel_usage: Joi.number().required(),
        trip_cost: Joi.number().allow("").optional(),
    });

    // get all Trip
    public getAllTripValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        driver_id: Joi.string().allow("").optional(),
        vehicle_id : Joi.string().allow("").optional(),
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional()
    });

}
export default TripValidator;