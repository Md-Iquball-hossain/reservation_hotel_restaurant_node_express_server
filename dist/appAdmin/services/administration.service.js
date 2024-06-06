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
    // create admin
    createAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
            const { hotel_id } = req.hotel_admin;
            const mUserAdminModel = this.Model.hotelAdminModel();
            const check = yield mUserAdminModel.getSingleAdmin({
                email: req.body.email,
            });
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
            const res = yield mUserAdminModel.insertUserAdmin(Object.assign(Object.assign({}, rest), { hotel_id }));
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
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, status } = req.query;
            const model = this.Model.hotelAdminModel();
            const { data, total } = yield model.getAllAdmin({
                hotel_id,
                limit: limit,
                skip: skip,
                status: status,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                total,
                data,
            };
        });
    }
    // get all permission
    getAllPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const model = this.Model.HotelrolePermissionModel();
            const data = yield model.getAllHotelPermissions({ hotel_id });
            const { permissions } = data[0];
            const groupedPermissions = {};
            permissions.forEach((entry) => {
                const permission_group_id = entry.permission_group_id;
                const permission = {
                    permission_id: entry.permission_id,
                    permission_name: entry.permission_name,
                    h_permission_id: entry.h_permission_id,
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
                const { id, hotel_id } = req.hotel_admin;
                const model = this.Model.HotelrolePermissionModel(trx);
                // check role
                const checkRole = yield model.getRoleByName(role_name, hotel_id);
                if (checkRole.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Already exist",
                    };
                }
                // insert role
                const res = yield model.createRole({
                    name: role_name,
                    hotel_id,
                });
                const permissionIds = permissions.map((item) => item.h_permission_id);
                const uniquePermissionIds = [...new Set(permissionIds)];
                // get all permission
                const checkAllPermission = yield model.getAllHotelPermission({
                    ids: permissionIds,
                    hotel_id,
                });
                if (checkAllPermission.length != uniquePermissionIds.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Permission ids are invalid",
                    };
                }
                const rolePermissionPayload = [];
                for (let i = 0; i < permissions.length; i++) {
                    rolePermissionPayload.push({
                        hotel_id,
                        h_permission_id: permissions[i].h_permission_id,
                        role_id: res[0],
                        permission_type: permissions[i].permission_type,
                        created_by: id,
                    });
                }
                // insert role permission
                yield model.createRolePermission(rolePermissionPayload);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // get role
    getRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.HotelrolePermissionModel();
            const data = yield model.getAllRole(req.hotel_admin.hotel_id);
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
            const model = this.Model.HotelrolePermissionModel();
            const data = yield model.getSingleRole(parseInt(id), req.hotel_admin.hotel_id);
            const _a = data[0], { permissions } = _a, rest = __rest(_a, ["permissions"]);
            const output_data = [];
            for (let i = 0; i < (permissions === null || permissions === void 0 ? void 0 : permissions.length); i++) {
                let found = false;
                for (let j = 0; j < output_data.length; j++) {
                    if (permissions[i].permission_group_id ==
                        output_data[j].permission_group_id) {
                        let found_sub = false;
                        for (let k = 0; k < output_data[j].subModules.length; k++) {
                            if (output_data[j].subModules[k].permission_id ==
                                permissions[i].permission_id) {
                                output_data[j].subModules[k].permission_type.push(permissions[i].permission_type);
                                found_sub = true;
                            }
                        }
                        if (!found_sub) {
                            output_data[j].subModules.push({
                                permission_id: permissions[i].permission_id,
                                h_permission_id: permissions[i].h_permission_id,
                                permission_name: permissions[i].permission_name,
                                permission_type: [permissions[i].permission_type],
                            });
                        }
                        found = true;
                    }
                }
                if (!found) {
                    output_data.push({
                        permission_group_id: permissions[i].permission_group_id,
                        permission_group_name: permissions[i].permission_group_name,
                        subModules: [
                            {
                                permission_id: permissions[i].permission_id,
                                h_permission_id: permissions[i].h_permission_id,
                                permission_name: permissions[i].permission_name,
                                permission_type: [permissions[i].permission_type],
                            },
                        ],
                    });
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, rest), { permission: output_data }),
            };
        });
    }
    updateSingleRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: role_id } = req.params;
            const { id: admin_id, hotel_id } = req.hotel_admin;
            const { role_name, added, deleted, } = req.body;
            const newPermission = [...new Set(added)];
            const deletedPermission = [...new Set(deleted)];
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.HotelrolePermissionModel(trx);
                if (role_name) {
                    // check role
                    const checkRole = yield model.getSingleRole(parseInt(role_id), hotel_id);
                    if (!checkRole.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "role not found",
                        };
                    }
                    yield model.updateSingleRole(parseInt(role_id), {
                        name: role_name,
                    }, hotel_id);
                }
                // ================== new permission added step ================= //
                if (newPermission.length) {
                    const addedPermissionIds = newPermission.map((item) => item.h_permission_id);
                    const uniquePermissionIds = [...new Set(addedPermissionIds)];
                    // get all permission
                    const checkAllPermission = yield model.getAllHotelPermission({
                        ids: addedPermissionIds,
                        hotel_id,
                    });
                    if (checkAllPermission.length != uniquePermissionIds.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: "Permission ids are invalid",
                        };
                    }
                    const rolePermissionPayload = [];
                    for (let i = 0; i < newPermission.length; i++) {
                        rolePermissionPayload.push({
                            hotel_id,
                            h_permission_id: newPermission[i].h_permission_id,
                            role_id: parseInt(role_id),
                            permission_type: newPermission[i].permission_type,
                        });
                    }
                    // insert role permission
                    yield model.createRolePermission(rolePermissionPayload);
                }
                // ===================  delete permission step ============= //
                if (deletedPermission.length) {
                    yield Promise.all(deletedPermission.map((item) => __awaiter(this, void 0, void 0, function* () {
                        yield model.deleteRolePermission(item.h_permission_id, item.permission_type, parseInt(role_id));
                    })));
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
            const { id: admin_id } = req.hotel_admin;
            const model = this.Model.rRolePermissionModel();
            const res = yield model.getAdminRolePermission({ id: admin_id });
            const { id, name, role_id, role_name, permissions } = res[0];
            const moduleObject = {};
            for (const permission of permissions) {
                const moduleId = permission.permission_group_id;
                if (moduleObject[moduleId]) {
                    moduleObject[moduleId].subModule.push({
                        permissionId: permission.permission_id,
                        permissionName: permission.permission_name,
                        permissionType: permission.permission_type,
                    });
                }
                else {
                    moduleObject[moduleId] = {
                        moduleId,
                        module: permission.permission_group_name,
                        subModule: [
                            {
                                permissionId: permission.permission_id,
                                permissionName: permission.permission_name,
                                permissionType: permission.permission_type,
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
//# sourceMappingURL=administration.service.js.map