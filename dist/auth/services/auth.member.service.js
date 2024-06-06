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
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const config_1 = __importDefault(require("../../config/config"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
class MemberAuthService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // registration
    registrationService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
                const memberModel = this.Model.memberModel(trx);
                const checkUser = yield memberModel.checkUser({
                    email: rest.email,
                    companyName: rest.companyName,
                    mobileNumber: rest.mobileNumber,
                });
                if (checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'Email or Company name or phone number is already exists',
                    };
                }
                const hashedPass = yield lib_1.default.hashPass(password);
                const registration = yield memberModel.insertUserMember(Object.assign({ password: hashedPass }, rest));
                const applicationModel = this.Model.applicationModel(trx);
                const application = yield applicationModel.insertApplication({
                    userMemberId: registration[0].id,
                });
                const tokenData = {
                    id: registration[0].id,
                    name: rest.name,
                    photo: null,
                    companyName: rest.companyName,
                    status: 'applying',
                    applicationId: application[0],
                    companyId: null,
                    email: rest.email,
                    emailVerification: false,
                    mobileNumber: rest.mobileNumber,
                    mobileNumberVerification: false,
                };
                const token = lib_1.default.createToken(tokenData, config_1.default.JWT_SECRET_MEMBER, '72h');
                if (registration.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: this.ResMsg.HTTP_OK,
                        data: Object.assign(Object.assign({}, tokenData), { membershipExpiryDate: null }),
                        token,
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.HTTP_BAD_REQUEST,
                    };
                }
            }));
        });
    }
    // login
    loginService({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberModel = this.Model.memberModel();
            const checkUser = yield memberModel.getSingleUser(email);
            if (!checkUser.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            if (checkUser[0].status === 'blacklisted' ||
                checkUser[0].status === 'disabled') {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: 'Your account is disabled',
                };
            }
            const _a = checkUser[0], { password: hashPass } = _a, rest = __rest(_a, ["password"]);
            const checkPass = yield lib_1.default.compare(password, hashPass);
            if (!checkPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.WRONG_CREDENTIALS,
                };
            }
            const tokenData = {
                id: rest.id,
                name: rest.name,
                photo: null,
                companyName: rest.companyName,
                status: rest.status,
                applicationId: rest.applicationId,
                companyId: rest.companyId,
                email: rest.email,
                emailVerification: rest.emailVerification,
                mobileNumber: rest.mobileNumber,
                mobileNumberVerification: rest.mobileNumberVerification,
            };
            const token = lib_1.default.createToken(tokenData, config_1.default.JWT_SECRET_MEMBER, '72h');
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
                data: rest,
                token,
            };
        });
    }
    // forget
    forgetService({ token, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_MEMBER);
            if (!tokenVerify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verifyEmail, type } = tokenVerify;
            if (email === verifyEmail && type === constants_1.OTP_TYPE_FORGET_MEMBER) {
                const hashedPass = yield lib_1.default.hashPass(password);
                const memberModel = this.Model.memberModel();
                yield memberModel.updateUserMember({ password: hashedPass }, { email: email });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.PASSWORD_CHANGED,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_FORBIDDEN,
                    message: this.ResMsg.HTTP_FORBIDDEN,
                };
            }
        });
    }
}
exports.default = MemberAuthService;
//# sourceMappingURL=auth.member.service.js.map