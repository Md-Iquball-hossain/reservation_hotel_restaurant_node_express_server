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
class RestaurantService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Restaurant service ======================//
    // get Single Restaurant
    getSingleRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, hotel_id, id } = req.rest_user;
            const data = yield this.Model.restaurantModel().getResAdmin({
                res_id,
                hotel_id,
            });
            const rolePermissionModel = this.Model.restaurantModel();
            const res = yield rolePermissionModel.getAdminRolePermission({
                id,
            });
            const { id: admin_id, name, role_id, role_name, permissions } = res[0];
            const output_data = [];
            for (let i = 0; i < (permissions === null || permissions === void 0 ? void 0 : permissions.length); i++) {
                let found = false;
                for (let j = 0; j < output_data.length; j++) {
                    if (permissions[i].permission_group_id ==
                        output_data[j].permission_group_id) {
                        output_data[j].permission_type.push(permissions[i].permission_type);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    output_data.push({
                        permission_group_id: permissions[i].permission_group_id,
                        permission_group_name: permissions[i].permission_group_name,
                        permission_type: [permissions[i].permission_type],
                    });
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, data[0]), { role_name, authorization: output_data }),
            };
        });
    }
    // udate hotel restaurant
    updateRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id: id, id: res_admin } = req.rest_user;
                const updatePayload = req.body;
                const files = req.files || [];
                let photo = updatePayload.photo;
                if (files.length) {
                    photo = files[0].filename;
                }
                const model = this.Model.restaurantModel(trx);
                const res = yield model.updateRestaurant(id, {
                    name: updatePayload.name,
                    phone: updatePayload.phone,
                    photo: photo,
                    address: updatePayload.address,
                    city: updatePayload.city,
                    country: updatePayload.country,
                    bin_no: updatePayload.bin_no,
                    updated_by: res_admin,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Restaurant Profile updated successfully",
                };
            }));
        });
    }
    // udate restaurant admin
    updateResAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: res_admin } = req.rest_user;
                const { id } = req.params;
                const updatePayload = req.body;
                const files = req.files || [];
                let avatar = updatePayload.avatar;
                if (files.length) {
                    avatar = files[0].filename;
                }
                const model = this.Model.restaurantModel(trx);
                yield model.updateResAdmin(parseInt(id), {
                    name: updatePayload.name,
                    phone: updatePayload.phone,
                    avatar: avatar,
                    status: updatePayload.status,
                    updated_by: res_admin,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Restaurant Admin updated successfully",
                };
            }));
        });
    }
}
exports.default = RestaurantService;
//# sourceMappingURL=restaurant.service.js.map