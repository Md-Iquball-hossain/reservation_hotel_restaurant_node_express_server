import Joi from "joi";

class MaintenanceValidator {
    // create Maintenance
    public createMaintenanceValidator = Joi.object({
        vehicle_id: Joi.string().required(),
        maintenance_by: Joi.string().required(),
        workshop_name: Joi.string().required(),
        maintenance_date: Joi.date().required(),
        maintenance_type: Joi.string().required(),
        maintenance_cost: Joi.number().required(),
        documents: Joi.string().allow("").optional(),
    });

    // get all Maintenance
    public getAllMaintenanceValidator = Joi.object({
        limit: Joi.string().allow("").optional(),
        skip: Joi.string().allow("").optional(),
        key: Joi.string().allow("").optional(),
        from_date: Joi.string().allow("").optional(),
        to_date: Joi.string().allow("").optional()
    });

    // update Maintenance
    public updateMaintenanceValidator = Joi.object({
        vehicle_id: Joi.string().allow("").optional(),
        maintenance_by: Joi.string().allow("").optional(),
        workshop_name: Joi.string().allow("").optional(),
        maintenance_date: Joi.date().allow("").optional(),
        maintenance_type: Joi.string().allow("").optional(),
        maintenance_cost: Joi.number().allow("").optional(),
        documents: Joi.string().allow("").optional(),
    });

}
export default MaintenanceValidator;