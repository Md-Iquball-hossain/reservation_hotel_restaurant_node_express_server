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
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
const restaurantCredential_template_1 = require("../../templates/restaurantCredential.template");
class hotelRestaurantService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Restaurant service ======================//
    // Create Restaurant
    createRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id, id: admin_id } = req.hotel_admin;
                const { name, res_email, phone, admin_name, email, password, permission, } = req.body;
                const model = this.Model.restaurantModel(trx);
                // Check restaurant email and name
                const checkRestaurant = yield model.getAllRestaurant({ hotel_id });
                let emailExists = false;
                let nameExists = false;
                if (checkRestaurant && checkRestaurant.data) {
                    emailExists = checkRestaurant.data.some((restaurant) => restaurant.res_email === res_email);
                    nameExists = checkRestaurant.data.some((restaurant) => restaurant.name === name);
                    if (emailExists) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Restaurant Email already exists with this hotel.",
                        };
                    }
                    if (nameExists) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Restaurant name already exists with this hotel.",
                        };
                    }
                }
                // Check admin email
                const adminEmailExists = yield model.getAllResAdminEmail({
                    email,
                    hotel_id,
                });
                if (adminEmailExists) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Restaurant Admin's email already exists with this hotel.",
                    };
                }
                const hashPass = yield lib_1.default.hashPass(password);
                const resCreate = yield model.createRestaurant({
                    name,
                    email: res_email,
                    phone,
                    hotel_id,
                    created_by: admin_id,
                });
                // ============ create hotel admin step ==============//
                // check all permission
                const checkAllPermission = yield model.getPermissionGroup({
                    ids: permission,
                });
                if (checkAllPermission.length != permission.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Invalid Permissions",
                    };
                }
                const res_permission_payload = permission.map((item) => {
                    return {
                        permission_grp_id: item,
                        res_id: resCreate[0],
                    };
                });
                // insert hotel permission
                const permissionRes = yield model.addedResPermission(res_permission_payload);
                // insert Role
                const roleRes = yield model.createRole({
                    name: "super-admin",
                    res_id: resCreate[0],
                });
                const rolePermissionPayload = [];
                for (let i = 0; i < permission.length; i++) {
                    for (let j = 0; j < 4; j++) {
                        rolePermissionPayload.push({
                            res_id: resCreate[0],
                            r_permission_id: permissionRes[0] + i,
                            permission_type: j == 0 ? "read" : j == 1 ? "write" : j == 2 ? "update" : "delete",
                            role_id: roleRes[0],
                        });
                    }
                }
                // insert role permission
                yield model.createRolePermission(rolePermissionPayload);
                // Restaurant Admin creation
                yield model.createResAdmin({
                    hotel_id,
                    email,
                    name: admin_name,
                    role: roleRes[0],
                    res_id: resCreate[0],
                    password: hashPass,
                    created_by: admin_id,
                });
                // send email with password
                yield lib_1.default.sendEmail(res_email, constants_1.OTP_FOR_CREDENTIALS, (0, restaurantCredential_template_1.newResutaurantUserAccount)(email, password, name));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Restaurant created successfully.",
                };
            }));
        });
    }
    // Get all Restaurant
    getAllRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, key } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllRestaurant({
                key: key,
                limit: limit,
                skip: skip,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // udate hotel restaurant
    updateHotelRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id, hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.restaurantModel(trx);
                yield model.updateRestaurant(parseInt(id), {
                    name: updatePayload.name,
                    status: updatePayload.status,
                    updated_by: admin_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Restaurant status updated successfully",
                };
            }));
        });
    }
}
exports.default = hotelRestaurantService;
//# sourceMappingURL=restaurant.hotel.service.js.map