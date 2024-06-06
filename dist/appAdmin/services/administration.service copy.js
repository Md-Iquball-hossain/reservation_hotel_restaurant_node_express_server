"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class AdministrationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create permission group
    createPermissionGroup(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.rRolePermissionModel();
            const res = yield model.rolePermissionGroup(Object.assign(Object.assign({}, req.body), { hotel_id, created_by: hotel_id }));
            if (res.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.HTTP_BAD_REQUEST,
            };
        });
    }
    // get permission group
    getPermissionGroup(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.rRolePermissionModel();
            const data = yield model.getRolePermissionGroup();
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data,
            };
        });
    }
    // create admin
    createAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
            const mUserAdminModel = this.Model.rUserAdminModel();
            const check = yield mUserAdminModel.getAdminByEmail(req.body.email);
            if (check.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: "Email already exist",
                };
            }
            const files = req.files || [];
            rest["password"] = yield lib_1.default.hashPass(password);
            rest["avatar"] = (files === null || files === void 0 ? void 0 : files.length) && files[0].filename;
            const res = yield mUserAdminModel.insertUserAdmin(rest);
            if (res.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.HTTP_BAD_REQUEST,
            };
        });
    }
    // get all admin
    getAllAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status } = req.query;
            const mUserAdminModel = this.Model.mUserAdminModel();
            const { data, total } = yield mUserAdminModel.getAllAdmin(limit, skip, status);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                total,
                data,
            };
        });
    }
    // create permission
    createPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { permission_group_id, name } = req.body;
            const model = this.Model.rRolePermissionModel();
            const res = yield model.createPermission({
                permission_group_id,
                name,
                created_by: hotel_id,
                hotel_id,
            });
            console.log({ res });
            if (res.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.HTTP_BAD_REQUEST,
            };
        });
    }
    // get all permission
    getAllPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.mRolePermissionModel();
            const data = yield model.getAllPermission();
            const groupedPermissions = {};
            data.forEach((entry) => {
                const permission_group_id = entry.permission_group_id;
                const permission = {
                    permission_id: entry.permission_id,
                    permission_name: entry.permission_name,
                };
                if (!groupedPermissions[permission_group_id]) {
                    groupedPermissions[permission_group_id] = {
                        permission_group_id: permission_group_id,
                        permissionGroupName: entry.permission_group_name,
                        permissions: [permission],
                    };
                }
                else {
                    groupedPermissions[permission_group_id].permissions.push(permission);
                }
            });
            const result = Object.values(groupedPermissions);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: result,
            };
        });
    }
    // create role
    createRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { role_name, permissions } = req.body;
                const { id } = req.admin;
                const model = this.Model.mRolePermissionModel(trx);
                // check role
                const checkRole = yield model.getRoleByName(role_name);
                if (checkRole.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Already exist",
                    };
                }
                const res = yield model.createRole({
                    role_name,
                });
                // permissions
                const permissionObj = permissions.map((item) => {
                    return {
                        role_id: res[0],
                        created_by: id,
                        permission_id: item.permission_id,
                        permission_type: item.permissionType,
                    };
                });
                const rolePermissionRes = yield model.createRolePermission(permissionObj);
                if (rolePermissionRes.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                    };
                }
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                };
            }));
        });
    }
    // get role
    getRole(Req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.mRolePermissionModel();
            const data = yield model.getRole();
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
    // get single role
    getSingleRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const model = this.Model.mRolePermissionModel();
            const originalData = yield model.getSingleRole(parseInt(id));
            const transformedData = {};
            originalData.forEach((item) => {
                const { role_id, role_name, permission_group_id, permission_group_name, permission_id, permission_name, permissionType, } = item;
                if (!transformedData[role_id]) {
                    transformedData[role_id] = {
                        role_id,
                        role_name,
                        permissions: [],
                    };
                }
                const permissionGroup = transformedData[role_id].permissions.find((group) => group.permission_group_id === permission_group_id);
                if (!permissionGroup) {
                    transformedData[role_id].permissions.push({
                        permission_group_id,
                        permission_group_name,
                        submodules: [],
                    });
                }
                const permission = {
                    permission_id,
                    permission_name,
                    operations: [permissionType],
                };
                let existingPermission = null;
                transformedData[role_id].permissions.forEach((group) => {
                    if (group.permission_group_id === permission_group_id) {
                        group.submodules.forEach((submodule) => {
                            if (submodule.permission_id === permission_id) {
                                existingPermission = submodule;
                            }
                        });
                        if (!existingPermission) {
                            group.submodules.push(permission);
                        }
                        else {
                            existingPermission.operations.push(permissionType);
                        }
                    }
                });
            });
            const finalResult = Object.values(transformedData);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: finalResult[0],
            };
        });
    }
    updateSingleRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: role_id } = req.params;
            const { id: adminId } = req.admin;
            const { role_name, added, deleted, } = req.body;
            const newPermission = [...new Set(added)];
            const oldPermission = [...new Set(deleted)];
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.mRolePermissionModel(trx);
                if (role_name) {
                    yield model.updateSingleRole(parseInt(role_id), {
                        name: role_name,
                    });
                }
                if (oldPermission.length) {
                    yield Promise.all(oldPermission.map((item) => __awaiter(this, void 0, void 0, function* () {
                        yield model.deleteRolePermission(item.permission_id, item.permissionType, parseInt(role_id));
                    })));
                }
                if (newPermission.length) {
                    const body = newPermission.map((item) => {
                        return {
                            roleId: parseInt(role_id),
                            permissionId: item.permission_id,
                            createdBy: adminId,
                            permissionType: item.permissionType,
                        };
                    });
                    yield model.createRolePermission(body);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Role updated successfully",
                };
            }));
        });
    }
    // get admin role
    getAdminRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: admin_id } = req.admin;
            const model = this.Model.mRolePermissionModel();
            const res = yield model.getAdminRolePermission(admin_id);
            const { id, name, role_id, role_name, permissions } = res[0];
            const moduleObject = {};
            for (const permission of permissions) {
                const moduleId = permission.permissiongGroupId;
                if (moduleObject[moduleId]) {
                    moduleObject[moduleId].subModule.push({
                        permissionId: permission.permissionId,
                        permissionName: permission.permissionName,
                        permissionType: permission.permissionType,
                    });
                }
                else {
                    moduleObject[moduleId] = {
                        moduleId,
                        module: permission.permissionGroupName,
                        subModule: [
                            {
                                permissionId: permission.permissionId,
                                permissionName: permission.permissionName,
                                permissionType: permission.permissionType,
                            },
                        ],
                    };
                }
            }
            const data = Object.values(moduleObject);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: { id, name, role_id, role_name, permissionList: data },
            };
        });
    }
}
exports.default = AdministrationService;
//# sourceMappingURL=administration.service%20copy.js.map