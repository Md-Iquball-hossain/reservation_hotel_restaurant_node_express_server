import Joi from "joi";

class VehiclesValidator {
    // create vehicles
    public createVehicleValidator = Joi.object({
        reg_number: Joi.string().allow("").optional(),
        model: Joi.string().required(),
        mileage: Joi.number().allow("").optional(),
        manufacturer: Joi.string().allow("").optional(),
        manufacture_year: Joi.date().allow("").optional(),
        license_plate: Joi.string().required(),
        license_expired: Joi.date().allow("").optional(),
        tax_token: Joi.string().allow("").optional(),
        token_expired: Joi.date().allow("").optional(),
        insurance_number: Joi.string().allow("").optional(),
        insurance_expired: Joi.date().allow("").optional(),
        vehicle_type: Joi.string().valid('motorcycle', 'car', 'suv', 'others'),
        fuel_type: Joi.string().valid('gasoline', 'diesel', 'lpg', 'coal', 
        'natural-gas', 'bio-fuels', 'hydrogen', 'nuclear'),
        vehicle_color: Joi.string().required(),
        vehicle_photo: Joi.string().allow("").optional(),
    });

    // get all vehicles
    public getAllVehicleValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        status: Joi.string().allow("").optional(),
    });

    // update vehicles
    public updateVehicleValidator = Joi.object({
        owner_id: Joi.number().optional(),
        reg_number: Joi.string().allow("").optional(),
        model: Joi.string().allow("").optional(),
        mileage: Joi.number().allow("").optional(),
        manufacturer: Joi.string().allow("").optional(),
        manufacture_year: Joi.date().allow("").optional(),
        license_plate: Joi.string().allow("").optional(),
        license_expired: Joi.date().optional(),
        tax_token: Joi.string().allow("").optional(),
        token_expired: Joi.date().allow("").optional(),
        insurance_number: Joi.string().allow("").optional(),
        insurance_expired: Joi.date().allow("").optional(),
        vehicle_type: Joi.string().valid('motorcycle', 'car', 'suv', 'others').optional(),
        fuel_type: Joi.string().valid('gasoline', 'diesel', 'lpg', 'coal', 
        'natural-gas', 'bio-fuels', 'hydrogen', 'nuclear').optional(),
        status: Joi.string().valid('available', 'maintenance', 'on-trip').optional(),
        vehicle_color: Joi.string().allow("").optional(),
        vehicle_photo: Joi.string().allow("").optional(),
    });

}
export default VehiclesValidator;