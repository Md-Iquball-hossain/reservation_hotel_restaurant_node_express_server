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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class MConfigurationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create permission group
    createPermissionGroup(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.mConfigurationModel();
            // get all permission group
            const checkGroup = yield model.getAllRolePermissionGroup({
                name: req.body.name,
            });
            if (checkGroup.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.HTTP_CONFLICT,
                };
            }
            yield model.createPermissionGroup(Object.assign(Object.assign({}, req.body), { created_by: id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get permission group
    getPermissionGroup(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.mConfigurationModel();
            const data = yield model.getAllRolePermissionGroup({});
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data,
            };
        });
    }
    // create permission
    createPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const { permission_group_id, name } = req.body;
            const model = this.Model.mConfigurationModel();
            yield model.createPermission({
                permission_group_id,
                name,
                created_by: id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get single hotel permission
    getSingleHotelPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.Model.mConfigurationModel().getAllPermissionByHotel(parseInt(id));
            const { permissions } = data[0];
            const groupedPermissions = {};
            permissions === null || permissions === void 0 ? void 0 : permissions.forEach((entry) => {
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
    // update hotel permission
    updateSingleHotelPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { added, deleted } = req.body;
                const model = this.Model.mConfigurationModel(trx);
                const checkHotelPermission = yield model.getAllPermissionByHotel(parseInt(id));
                const { permissions } = checkHotelPermission[0];
                let distinctValueForAdd = [];
                let existRolePermissionIds = [];
                if (permissions === null || permissions === void 0 ? void 0 : permissions.length) {
                    existRolePermissionIds = permissions.map((item) => item.h_permission_id);
                    if (added === null || added === void 0 ? void 0 : added.length) {
                        let existHotelPermissionIds;
                        existHotelPermissionIds = permissions.map((item) => item.permission_id);
                        for (let i = 0; i < added.length; i++) {
                            let found = false;
                            for (let j = 0; j < existHotelPermissionIds.length; j++) {
                                if (added[i] == existHotelPermissionIds[j]) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                distinctValueForAdd.push(added[i]);
                            }
                        }
                    }
                }
                else {
                    distinctValueForAdd = added;
                }
                if (distinctValueForAdd.length) {
                    const hotelPermissionInsertPayload = distinctValueForAdd.map((item) => {
                        return {
                            hotel_id: id,
                            permission_id: item,
                        };
                    });
                    // insert hotel permission payload
                    yield model.addedHotelPermission(hotelPermissionInsertPayload);
                }
                if (deleted === null || deleted === void 0 ? void 0 : deleted.length) {
                    const deleteRolePermission = [];
                    for (let i = 0; i < deleted.length; i++) {
                        for (let j = 0; j < permissions.length; j++) {
                            if (deleted[i] == permissions[j].permission_id) {
                                deleteRolePermission.push(permissions[j].h_permission_id);
                            }
                        }
                    }
                    // delete role permission
                    if (deleteRolePermission.length) {
                        yield model.deleteHotelRolePermission(parseInt(id), deleteRolePermission);
                    }
                    // delte hotel role permission
                    yield model.deleteHotelPermission(parseInt(id), deleted);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Successfully Permission Updated",
                };
            }));
        });
    }
    // get all permission
    getAllPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.mConfigurationModel();
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
}
exports.default = MConfigurationService;
//# sourceMappingURL=mConfiguration.service.js.map