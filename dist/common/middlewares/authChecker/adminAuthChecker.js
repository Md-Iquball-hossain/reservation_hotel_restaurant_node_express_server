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
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const tokenService_1 = __importDefault(require("../../../utils/lib/tokenService"));
const config_1 = __importDefault(require("../../../config/config"));
class AdminAuthChecker {
    constructor() {
        this.authChecker = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization) {
                return res
                    .status(401)
                    .json({ success: false, message: "Unauthorized request!" });
            }
            const authSplit = authorization.split(" ");
            if (authSplit.length !== 2) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authorization structure.",
                });
            }
            const verify = lib_1.default.verifyToken(authSplit[1], config_1.default.JWT_SECRET_ADMIN);
            if (!verify) {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid token or token expired!" });
            }
            else {
                if (verify.type !== "admin" || verify.au_status === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "Wrong token or blocked user",
                    });
                }
                else {
                    req.user = verify;
                    next();
                }
            }
        });
        this.tokenService = new tokenService_1.default("admin_auth_secret");
    }
}
exports.default = AdminAuthChecker;
//# sourceMappingURL=adminAuthChecker.js.map