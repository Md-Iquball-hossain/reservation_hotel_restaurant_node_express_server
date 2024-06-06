"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdministrationResValidator {
    constructor() {
        // create Admin input validator
        this.createAdminValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            phone: joi_1.default.string().optional(),
            role: joi_1.default.number().required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required(),
        });
        // create permission group validator
        this.createPermissionGroupValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        // get all admin query validator
        this.getAllAdminQueryValidator = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.string().valid("active", "blocked").optional(),
        });
        // create permission validator
        this.createPermissionValidator = joi_1.default.object({
            permission_group_id: joi_1.default.number().required(),
            name: joi_1.default.array().items(joi_1.default.string()).required(),
        });
        // Define Joi schema for permissions
        this.permissionSchema = joi_1.default.object({
            r_permission_id: joi_1.default.number().required(),
            permission_type: joi_1.default.string()
                .valid("read", "write", "update", "delete")
                .required(),
        });
        // Define Joi schema for the entire object
        this.createRolePermissionValidator = joi_1.default.object({
            role_name: joi_1.default.string().required(),
            permissions: joi_1.default.array().items(this.permissionSchema).min(1).required(),
        });
        // get all Employee query validator
        this.getAllEmployeeQueryValidator = joi_1.default.object({
            status: joi_1.default.string().valid("0", "1"),
            key: joi_1.default.string().allow("").optional(),
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = AdministrationResValidator;
//# sourceMappingURL=admin-role.validator.js.map