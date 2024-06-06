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
class AuthHotelUserService extends abstract_service_1.default {
    constructor() {
        super();
    }
    registration(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { email, password } = _a, rest = __rest(_a, ["email", "password"]);
                const { id: hotel_id } = req.web_token;
                const guestModel = this.Model.guestModel(trx);
                const checkUser = yield guestModel.getSingleGuest({
                    email,
                    hotel_id,
                });
                const { data } = yield guestModel.getAllGuestEmail({ email, hotel_id });
                if (data.length > 0) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Email already exists, give another unique email address",
                    };
                }
                const files = req.files || [];
                if (files.length) {
                    rest["photo"] = files[0].filename;
                }
                const hashPass = yield lib_1.default.hashPass(password);
                if (checkUser.length) {
                    const { id, user_type } = checkUser[0];
                    if (user_type == "user") {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Already registered",
                        };
                    }
                    yield guestModel.updateSingleGuest(Object.assign(Object.assign({}, rest), { pasword: hashPass, user_type: "user" }), { id });
                }
                else {
                    yield guestModel.createGuest(Object.assign(Object.assign({}, rest), { email, password: hashPass, hotel_id }));
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Registration successful",
                };
            }));
        });
    }
    // login
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const { id: hotel_id } = req.web_token;
            const model = this.Model.clientModel();
            const checkUser = yield model.getSingleUser({ email, hotel_id });
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Email is not correct",
                };
            }
            const _a = checkUser[0], { password: hashPass } = _a, rest = __rest(_a, ["password"]);
            const checkPass = yield lib_1.default.compare(password, hashPass);
            if (!checkPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Password is not correct",
                };
            }
            console.log({ hashPass, checkPass });
            const token = lib_1.default.createToken(Object.assign(Object.assign({}, rest), { type: "hotel_user" }), config_1.default.JWT_SECRET_H_USER, "214h");
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Login successful",
                data: rest,
                token: token,
            };
        });
    }
    // get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id, hotel_id } = req.hotel_user;
            const data = yield this.Model.clientModel().getSingleUser({
                id: user_id,
                hotel_id,
            });
            const _a = data[0], { password } = _a, rest = __rest(_a, ["password"]);
            if (data.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: rest,
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
            const { id: user_id, hotel_id } = req.hotel_user;
            const model = this.Model.clientModel();
            const checkAdmin = yield model.getSingleUser({
                id: user_id,
                hotel_id
            });
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
            yield model.updateUser(req.body, { email });
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
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_H_USER);
            if (!tokenVerify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verifyEmail, type } = tokenVerify;
            if (email === verifyEmail && type === constants_1.OTP_TYPE_FORGET_H_USER) {
                const hashPass = yield lib_1.default.hashPass(password);
                const userModel = this.Model.clientModel();
                yield userModel.updateUser({ password: hashPass }, { email });
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
exports.default = AuthHotelUserService;
//# sourceMappingURL=auth.hotel-user.service.js.map