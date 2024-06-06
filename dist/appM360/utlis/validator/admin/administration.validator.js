"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class AdministrationValidator {
    // create Admin input validator
    createAdminValidator() {
        return [
            (0, express_validator_1.body)("name", "Enter name").exists().isString(),
            (0, express_validator_1.body)("phone", "Enter phone").isString().optional(),
            (0, express_validator_1.body)("role", "Enter valid role").exists().isInt(),
            (0, express_validator_1.body)("email", "Enter valid email or phone").exists().isEmail(),
            (0, express_validator_1.body)("password", "Enter valid password minimun length 8")
                .exists()
                .isString()
                .isLength({ min: 8 }),
        ];
    }
    // create permission group validator
    createPermissionGroupValidator() {
        return [(0, express_validator_1.body)("name", "Enter name").exists().isString()];
    }
    // create permission validator
    createPermissionValidator() {
        return [
            (0, express_validator_1.body)("permissionGroupId")
                .isInt()
                .withMessage("Permission group ID must be an integer"),
            (0, express_validator_1.body)("name")
                .isArray({ min: 1 })
                .withMessage("Name must be an array with at least one element"),
        ];
    }
    // create role permission
    createRolePermissionValidator() {
        return [
            (0, express_validator_1.body)("roleId").isInt().withMessage("Role ID must be an integer"),
            (0, express_validator_1.body)("permissions").isArray().withMessage("Permissions must be an array"),
            (0, express_validator_1.body)("permissions.*.permissionId").isInt(),
            (0, express_validator_1.body)("permissions.*.permissionType")
                .isIn(["read", "write", "update", "delete"])
                .withMessage('Permission type must be either "read" or "write" or "update" or "delete'),
        ];
    }
    // create role
    createRoleValidator() {
        return [
            (0, express_validator_1.body)("role_name", "Enter role_name").exists().isString(),
            (0, express_validator_1.body)("permissions", "Enter permissions").exists(),
        ];
    }
}
exports.default = AdministrationValidator;
//# sourceMappingURL=administration.validator.js.map