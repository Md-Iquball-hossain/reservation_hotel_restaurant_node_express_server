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
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const config_1 = __importDefault(require("../../config/config"));
const constants_1 = require("../../utils/miscellaneous/constants");
class RestaurantAuthService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // login Restaurant
    loginRestaurant(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const model = this.Model.restaurantModel();
            const checkUser = yield model.getSingleResAdmin({ email });
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Email is not correct",
                };
            }
            const _a = checkUser[0], { password: hashPass, status } = _a, rest = __rest(_a, ["password", "status"]);
            if (status !== "active") {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Admin account is disabled by hotel Admin",
                };
            }
            const checkPass = yield lib_1.default.compare(password, hashPass);
            if (!checkPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Password is not correct",
                };
            }
            const token = lib_1.default.createToken(Object.assign(Object.assign({}, rest), { status }), config_1.default.JWT_SECRET_H_RESTURANT, "48h");
            const rolePermissionModel = this.Model.restaurantModel();
            const res = yield rolePermissionModel.getAdminRolePermission({
                id: checkUser[0].id,
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
                message: "Login successful",
                data: Object.assign(Object.assign({}, rest), { status, authorization: output_data }),
                token: token,
            };
        });
    }
    // forget
    forgetService({ token, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_H_RESTURANT);
            if (!tokenVerify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verifyEmail, type } = tokenVerify;
            if (email === verifyEmail && type === constants_1.OTP_TYPE_FORGET_RES_ADMIN) {
                const hashPass = yield lib_1.default.hashPass(password);
                const adminModel = this.Model.restaurantModel();
                yield adminModel.updateAdmin({ password: hashPass }, { email });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_FULFILLED,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                };
            }
        });
    }
}
exports.default = RestaurantAuthService;
//# sourceMappingURL=auth.rest-user.service.js.map