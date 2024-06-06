"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MAdministrationValidator {
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
        // create role permission
        // public createRolePermissionValidator() {
        //   return [
        //     body("roleId").isInt().withMessage("Role ID must be an integer"),
        //     body("permissions").isArray().withMessage("Permissions must be an array"),
        //     body("permissions.*.permissionId").isInt(),
        //     body("permissions.*.permissionType")
        //       .isIn(["read", "write", "update", "delete"])
        //       .withMessage(
        //         'Permission type must be either "read" or "write" or "update" or "delete'
        //       ),
        //   ];
        // }
        // Define Joi schema for permissions
        this.permissionSchema = joi_1.default.object({
            permission_id: joi_1.default.number().required(),
            permission_type: joi_1.default.string()
                .valid("read", "write", "update", "delete")
                .required(),
        });
        // Define Joi schema for the entire object
        this.createRolePermissionValidator = joi_1.default.object({
            role_name: joi_1.default.string().required(),
            permissions: joi_1.default.array().items(this.permissionSchema).min(1).required(),
        });
    }
}
exports.default = MAdministrationValidator;
//# sourceMappingURL=mAdministration.validator.js.map