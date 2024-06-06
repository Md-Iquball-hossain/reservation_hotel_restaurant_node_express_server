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
const config_1 = __importDefault(require("../../config/config"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
class MAdminAuthService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // login
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.mUserAdminModel();
            const checkUser = yield model.getAdminByEmail(email);
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            const _a = checkUser[0], { password: hashPass, created_at } = _a, rest = __rest(_a, ["password", "created_at"]);
            const checkPass = yield lib_1.default.compare(password, hashPass);
            if (!checkPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            const token = lib_1.default.createToken(Object.assign(Object.assign({}, rest), { type: "admin" }), config_1.default.JWT_SECRET_ADMIN, "24h");
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
                data: rest,
                token,
            };
        });
    }
    // get profile
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.Model.mUserAdminModel().getAdminById(id);
            const rolePermissionModel = this.Model.mRolePermissionModel();
            const res = yield rolePermissionModel.getAdminRolePermission(id);
            const { id: admin_id, name, role_id, role_name, permissions } = res[0];
            const output_data = [];
            permissions.forEach((entry) => {
                let found = false;
                output_data.forEach((item) => {
                    if (item.subModules[0].permission_id === entry.permission_id) {
                        item.subModules[0].permission_type.push(entry.permission_type);
                        found = true;
                    }
                });
                if (!found) {
                    output_data.push({
                        permission_group_id: entry.permission_group_id,
                        permission_group_name: entry.permission_group_name,
                        subModules: [
                            {
                                permission_id: entry.permission_id,
                                permission_name: entry.permission_name,
                                permission_type: [entry.permission_type],
                            },
                        ],
                    });
                }
            });
            if (data.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: Object.assign(Object.assign({}, data[0]), { authorization: output_data }),
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
        });
    }
    // update profile
    updateProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const checkAdmin = yield this.Model.mUserAdminModel().getAdminById(id);
            if (!checkAdmin.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const files = req.files || [];
            if (files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const { email } = checkAdmin[0];
            const model = this.Model.mUserAdminModel();
            yield model.updateAdmin(req.body, { email });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Profile updated successfully",
            };
        });
    }
    // forget
    forgetService({ token, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_ADMIN);
            if (!tokenVerify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verifyEmail, type } = tokenVerify;
            if (email === verifyEmail && type === constants_1.OTP_TYPE_FORGET_ADMIN) {
                const hashPass = yield lib_1.default.hashPass(password);
                const adminModel = this.Model.mUserAdminModel();
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
exports.default = MAdminAuthService;
//# sourceMappingURL=mAuth.admin.service%20copy.js.map