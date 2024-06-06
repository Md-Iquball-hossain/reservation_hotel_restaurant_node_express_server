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
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
const mHotelUserCredentials_template_1 = require("../../templates/mHotelUserCredentials.template");
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
class MHotelService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create hotel
    createHotel(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { hotel_email, user_name, user_email, password, permission, hotel_name } = _a, rest = __rest(_a, ["hotel_email", "user_name", "user_email", "password", "permission", "hotel_name"]);
                if (rest.expiry_date < new Date()) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                        message: "Date expiry cannot shorter than present Date",
                    };
                }
                const files = req.files || [];
                const model = this.Model.HotelModel(trx);
                const hotelAdminModel = this.Model.hotelAdminModel(trx);
                //   check hotel
                const checkHotelEmail = yield model.getSingleHotel({
                    email: hotel_email,
                });
                if (checkHotelEmail.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                // check admin
                const checkHotelAdmin = yield hotelAdminModel.getSingleAdmin({
                    email: user_email,
                });
                if (checkHotelAdmin.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Admin email already exist",
                    };
                }
                if (files.length) {
                    rest["logo"] = files[0].filename;
                }
                const hashPass = yield lib_1.default.hashPass(password);
                // create hotel
                const hotelRes = yield model.createHotel(Object.assign({ name: hotel_name, email: hotel_email }, rest));
                // create web token
                // const web_token = new SyncCryptoService().encrypt("57");
                // update hotel
                // await model.updateHotel({ web_token }, { id: hotelRes[0] });
                // ============ create hotel admin step ==============//
                const hotelAdminRoleModel = this.Model.HotelrolePermissionModel(trx);
                const mRolePermissionModel = this.Model.mRolePermissionModel(trx);
                const extractPermission = JSON.parse(permission);
                // check all permission
                const checkAllPermission = yield mRolePermissionModel.getAllPermission({
                    ids: extractPermission,
                });
                if (checkAllPermission.length != extractPermission.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Invalid Permissions",
                    };
                }
                const hotel_permission_payload = extractPermission.map((item) => {
                    return {
                        permission_id: item,
                        hotel_id: hotelRes[0],
                    };
                });
                // insert hotel permission
                const permissionRes = yield hotelAdminRoleModel.addedHotelPermission(hotel_permission_payload);
                // insert Role
                const roleRes = yield hotelAdminRoleModel.createRole({
                    name: "super-admin",
                    hotel_id: hotelRes[0],
                });
                const rolePermissionPayload = [];
                for (let i = 0; i < extractPermission.length; i++) {
                    for (let j = 0; j < 4; j++) {
                        rolePermissionPayload.push({
                            hotel_id: hotelRes[0],
                            h_permission_id: permissionRes[0] + i,
                            permission_type: j == 0 ? "read" : j == 1 ? "write" : j == 2 ? "update" : "delete",
                            role_id: roleRes[0],
                        });
                    }
                }
                // insert role permission
                yield hotelAdminRoleModel.createRolePermission(rolePermissionPayload);
                // insert user admin
                const res = yield hotelAdminModel.insertUserAdmin({
                    email: user_email,
                    name: user_name,
                    password: hashPass,
                    role: roleRes[0],
                    hotel_id: hotelRes[0],
                });
                // send email with password
                yield lib_1.default.sendEmail(hotel_email, constants_1.OTP_FOR_CREDENTIALS, (0, mHotelUserCredentials_template_1.newHotelUserAccount)(user_email, password, hotel_name));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: {
                        id: res[0],
                    },
                    // web_token,
                };
            }));
        });
    }
    // get all hotel
    getAllHotel(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, from_date, to_date, name, limit, skip, group, city } = req.query;
            const model = this.Model.HotelModel();
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const { data, total } = yield model.getAllHotel({
                name: name,
                status: status,
                from_date: from_date,
                to_date: endDate,
                limit: limit,
                skip: skip,
                group: group,
                city: city,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get single hotel
    getSingleHotel(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const model = this.Model.HotelModel();
            const user = yield model.getSingleHotel({ id: parseInt(id) });
            if (!user.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const _a = user[0], { password } = _a, rest = __rest(_a, ["password"]);
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
                data: Object.assign(Object.assign({}, rest), { permissions: result }),
            };
        });
    }
    // update hotel
    updateHotel(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const { id } = req.params;
                if (body.expiry_date < new Date()) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                        message: "Date expiry cannot shorter than present Date",
                    };
                }
                const files = req.files || [];
                const model = this.Model.HotelModel(trx);
                // check user
                const checkUser = yield model.getSingleHotel({ email: body.email });
                if (!checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                if (files.length) {
                    body["logo"] = files[0].filename;
                }
                yield model.updateHotel(body, { id: parseInt(id) });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "User updated successfully",
                };
            }));
        });
    }
}
exports.default = MHotelService;
//# sourceMappingURL=mHotel.service.js.map