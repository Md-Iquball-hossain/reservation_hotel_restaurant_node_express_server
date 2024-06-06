import Joi from "joi";

class ParkingValidator {
    // create Parking
    public createParkingValidator = Joi.object({
        parking_area: Joi.string().required(),
        parking_size: Joi.string().valid('compact', 'standard', 'large'),
        par_slot_number: Joi.string().allow("").optional(),
    });

    // get all Parking
    public getAllParkingValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        parking_size: Joi.string().allow("").optional(),
        status: Joi.string().allow("").optional(),
    });

    // update Parking
    public updateParkingValidator = Joi.object({
        parking_area: Joi.string().allow("").optional(),
        parking_size: Joi.string().valid('compact', 'standard', 'large'),
        par_slot_number: Joi.string().allow("").optional(),
        status: Joi.number().valid(0,1),
    });

    // create Vehicle Parking
    public createVehicleParkingValidator = Joi.object({
        vehicle_id: Joi.number().required(),
        parking_id: Joi.number().required(),
        assigned_time: Joi.date().allow("").optional(),
    });

    // get all  vehicle Parking
    public getAllVehicleParkingValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        status: Joi.string().allow("").optional(),
        vehicle_id: Joi.string().allow("").optional(),
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional()
    });

    // update vehicle Parking
    public updateVehicleParkingValidator = Joi.object({
        vehicle_id: Joi.number().allow("").optional(),
        left_time: Joi.date().allow("").optional(),
    });

}
export default ParkingValidator;