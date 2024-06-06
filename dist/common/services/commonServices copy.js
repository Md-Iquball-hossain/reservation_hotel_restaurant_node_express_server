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
const sendEmailOtp_1 = require("../../templates/sendEmailOtp");
const config_1 = __importDefault(require("../../config/config"));
const constants_1 = require("../../utils/miscellaneous/constants");
class CommonService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // send otp to email
    sendOtpToEmailService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { email, type } = req.body;
                switch (type) {
                    case constants_1.OTP_TYPE_FORGET_M_ADMIN:
                        const adminModel = this.Model.mUserAdminModel(trx);
                        const checkAdmin = yield adminModel.getAdminByEmail(email);
                        if (!checkAdmin.length) {
                            return {
                                success: false,
                                code: this.StatusCode.HTTP_NOT_FOUND,
                                message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                            };
                        }
                        break;
                    case constants_1.OTP_TYPE_FORGET_H_USER:
                        const hotelUserModel = this.Model.HotelModel(trx);
                        const checkHotelUser = yield hotelUserModel.getSingleHotel({
                            email,
                        });
                        if (!checkHotelUser.length) {
                            return {
                                success: false,
                                code: this.StatusCode.HTTP_NOT_FOUND,
                                message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                            };
                        }
                        break;
                    case constants_1.OTP_TYPE_FORGET_RES_ADMIN:
                        const Model = this.Model.restaurantModel(trx);
                        const checkResAdmin = yield Model.getResAdminByEmail(email);
                        if (!checkResAdmin.length) {
                            return {
                                success: false,
                                code: this.StatusCode.HTTP_NOT_FOUND,
                                message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                            };
                        }
                        break;
                    default:
                        break;
                }
                const commonModel = this.Model.commonModel(trx);
                const checkOtp = yield commonModel.getOTP({
                    email: email,
                    type: type,
                });
                if (checkOtp.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_GONE,
                        message: this.ResMsg.THREE_TIMES_EXPIRED,
                    };
                }
                const otp = lib_1.default.otpGenNumber(6);
                const hashed_otp = yield lib_1.default.hashPass(otp);
                const send = yield lib_1.default.sendEmail(email, constants_1.OTP_EMAIL_SUBJECT, (0, sendEmailOtp_1.sendEmailOtpTemplate)(otp, constants_1.OTP_FOR));
                if (send) {
                    yield commonModel.insertOTP({
                        hashed_otp: hashed_otp,
                        email: email,
                        type: type,
                    });
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: this.ResMsg.OTP_SENT,
                        data: {
                            email,
                        },
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                    };
                }
            }));
        });
    }
    // match email otp
    matchEmailOtpService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { email, otp, type } = req.body;
                const commonModel = this.Model.commonModel(trx);
                const checkOtp = yield commonModel.getOTP({
                    email,
                    type,
                });
                if (!checkOtp.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: this.ResMsg.OTP_EXPIRED,
                    };
                }
                const { id: email_otp_id, hashed_otp, tried } = checkOtp[0];
                if (tried > 3) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_GONE,
                        message: this.ResMsg.TOO_MUCH_ATTEMPT,
                    };
                }
                const otpValidation = yield lib_1.default.compare(otp, hashed_otp);
                console.log({ otpValidation });
                if (otpValidation) {
                    yield commonModel.updateOTP({
                        tried: tried + 1,
                        matched: 1,
                    }, { id: email_otp_id });
                    console.log("check OTP", constants_1.OTP_TYPE_FORGET_H_USER);
                    let secret = config_1.default.JWT_SECRET_HOTEL_ADMIN;
                    switch (type) {
                        case constants_1.OTP_TYPE_FORGET_M_ADMIN:
                            secret = config_1.default.JWT_SECRET_M_ADMIN;
                            break;
                        case constants_1.OTP_TYPE_FORGET_HOTEL_ADMIN:
                            secret = config_1.default.JWT_SECRET_HOTEL_ADMIN;
                            break;
                        case constants_1.OTP_TYPE_FORGET_H_USER:
                            secret = config_1.default.JWT_SECRET_H_USER;
                            break;
                        case constants_1.OTP_TYPE_FORGET_RES_ADMIN:
                            secret = config_1.default.JWT_SECRET_H_RESTURANT;
                            break;
                        default:
                            break;
                    }
                    const token = lib_1.default.createToken({
                        email: email,
                        type: type,
                    }, secret, "5m");
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_ACCEPTED,
                        message: this.ResMsg.OTP_MATCHED,
                        token,
                    };
                }
                else {
                    yield commonModel.updateOTP({
                        tried: tried + 1,
                    }, { id: email_otp_id });
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_UNAUTHORIZED,
                        message: this.ResMsg.OTP_INVALID,
                    };
                }
            }));
        });
    }
    // common change password
    changePassword({ password, table, userIdField, userId, passField, schema, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPass = yield lib_1.default.hashPass(password);
            const commonModel = this.Model.commonModel();
            const updatePass = yield commonModel.updatePassword({
                table,
                userIdField,
                userId,
                passField,
                schema,
                hashedPass,
            });
            if (updatePass) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Password changed successfully!",
                };
            }
            else {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: "Cannot change password!",
                };
            }
        });
    }
    // user password verify
    userPasswordVerify({ table, passField, oldPassword, userIdField, userId, schema, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const commonModel = this.Model.commonModel();
            const user = yield commonModel.getUserPassword({
                table,
                schema,
                passField,
                userIdField,
                userId,
            });
            if (!user.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: "No user found with this id",
                };
            }
            const checkOldPass = yield lib_1.default.compare(oldPassword, user[0][passField]);
            if (!checkOldPass) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: "Old password is not correct!",
                };
            }
            else {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Password is verified!",
                };
            }
        });
    }
}
exports.default = CommonService;
//# sourceMappingURL=commonServices%20copy.js.map