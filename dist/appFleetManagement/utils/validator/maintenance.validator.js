"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MaintenanceValidator {
    constructor() {
        // create Maintenance
        this.createMaintenanceValidator = joi_1.default.object({
            vehicle_id: joi_1.default.string().required(),
            maintenance_by: joi_1.default.string().required(),
            workshop_name: joi_1.default.string().required(),
            maintenance_date: joi_1.default.date().required(),
            maintenance_type: joi_1.default.string().required(),
            maintenance_cost: joi_1.default.number().required(),
            documents: joi_1.default.string().allow("").optional(),
        });
        // get all Maintenance
        this.getAllMaintenanceValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional()
        });
        // update Maintenance
        this.updateMaintenanceValidator = joi_1.default.object({
            vehicle_id: joi_1.default.string().allow("").optional(),
            maintenance_by: joi_1.default.string().allow("").optional(),
            workshop_name: joi_1.default.string().allow("").optional(),
            maintenance_date: joi_1.default.date().allow("").optional(),
            maintenance_type: joi_1.default.string().allow("").optional(),
            maintenance_cost: joi_1.default.number().allow("").optional(),
            documents: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = MaintenanceValidator;
//# sourceMappingURL=maintenance.validator.js.map