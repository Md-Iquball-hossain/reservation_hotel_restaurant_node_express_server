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
const abstract_service_1 = __importDefault(require("../../../abstarcts/abstract.service"));
const config_1 = __importDefault(require("../../../config/config"));
const crypto_1 = require("../../../utils/lib/crypto");
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const responseMessage_1 = __importDefault(require("../../../utils/miscellaneous/responseMessage"));
const statusCode_1 = __importDefault(require("../../../utils/miscellaneous/statusCode"));
class AuthChecker extends abstract_service_1.default {
    constructor() {
        super();
        // admin auth checker
        this.mAdminAuthChecker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            const authSplit = authorization.split(" ");
            if (authSplit.length !== 2) {
                return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                    success: false,
                    message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                });
            }
            const verify = lib_1.default.verifyToken(authSplit[1], config_1.default.JWT_SECRET_M_ADMIN);
            if (!verify) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            else {
                if (verify.type !== "admin" || verify.status === 0) {
                    return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                        success: false,
                        message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                    });
                }
                else {
                    req.admin = verify;
                    next();
                }
            }
        });
        // hotel admin auth checker
        this.hotelAdminAuthChecker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            const authSplit = authorization.split(" ");
            if (authSplit.length !== 2) {
                return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                    success: false,
                    message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                });
            }
            const verify = lib_1.default.verifyToken(authSplit[1], config_1.default.JWT_SECRET_HOTEL_ADMIN);
            if (!verify) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            else {
                if (verify.type !== "admin" || verify.status === 0) {
                    return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                        success: false,
                        message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                    });
                }
                else {
                    req.hotel_admin = verify;
                    next();
                }
            }
        });
        // hotel user auth checker
        this.hotelUserAuthChecker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            const authSplit = authorization.split(" ");
            if (authSplit.length !== 2) {
                return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                    success: false,
                    message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                });
            }
            const verify = lib_1.default.verifyToken(authSplit[1], config_1.default.JWT_SECRET_H_USER);
            if (!verify) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            else {
                if (verify.type !== "hotel_user" ||
                    verify.status === "blocked" ||
                    verify.status === "expired") {
                    return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                        success: false,
                        message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                    });
                }
                else {
                    req.hotel_user = verify;
                    next();
                }
            }
        });
        // hotel user auth checker
        this.hotelRestAuthChecker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            const authSplit = authorization.split(" ");
            if (authSplit.length !== 2) {
                return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                    success: false,
                    message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                });
            }
            const verify = lib_1.default.verifyToken(authSplit[1], config_1.default.JWT_SECRET_H_RESTURANT);
            if (!verify) {
                return res
                    .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                    .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
            }
            else {
                if (verify.status === "blocked" || verify.status === "inactive") {
                    return res.status(statusCode_1.default.HTTP_UNAUTHORIZED).json({
                        success: false,
                        message: responseMessage_1.default.HTTP_UNAUTHORIZED,
                    });
                }
                else {
                    req.rest_user = verify;
                    next();
                }
            }
        });
        // web token verify checker
        this.webTokenVerfiyChecker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const web_token = req.headers.web_token;
                if (!web_token) {
                    return res
                        .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                        .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
                }
                const verify = new crypto_1.SyncCryptoService().decrypt(web_token);
                if (!verify.success) {
                    return res
                        .status(statusCode_1.default.HTTP_UNAUTHORIZED)
                        .json({ success: false, message: responseMessage_1.default.HTTP_UNAUTHORIZED });
                }
                else {
                    req.web_token = { id: parseInt(verify.data) };
                    next();
                }
            }
            catch (err) {
                res
                    .status(statusCode_1.default.HTTP_BAD_REQUEST)
                    .json({
                    success: false,
                    message: err.reason ? err.reason : responseMessage_1.default.HTTP_UNAUTHORIZED,
                });
            }
        });
    }
}
exports.default = AuthChecker;
//# sourceMappingURL=authChecker.js.map