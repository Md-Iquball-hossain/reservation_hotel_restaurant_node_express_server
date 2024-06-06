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
const abstract_controller_1 = __importDefault(require("../../abstarcts/abstract.controller"));
const commonServices_1 = __importDefault(require("../../common/services/commonServices"));
const mAuth_validator_1 = __importDefault(require("../utils/validator/mAuth.validator"));
const auth_admin_service_1 = __importDefault(require("../services/auth.admin.service"));
class AdminAuthController extends abstract_controller_1.default {
    constructor() {
        super();
        this.adminAuthService = new auth_admin_service_1.default();
        this.commonService = new commonServices_1.default();
        this.mAuthValidator = new mAuth_validator_1.default();
        // login
        this.login = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.loginValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const _a = yield this.adminAuthService.login({
                email,
                password,
            }), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get profile
        this.getProfile = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.adminAuthService.getProfile(req.admin.id), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // update profile
        this.updateProfile = this.asyncWrapper.wrap({ bodySchema: this.mAuthValidator.updateProfileValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.adminAuthService.updateProfile(req), { code } = _c, data = __rest(_c, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        // forget password
        this.forgetPassword = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.forgetPasswordValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, email, password } = req.body;
            const _d = yield this.adminAuthService.forgetService({
                token,
                email,
                password,
            }), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // change password
        this.changeAdminPassword = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.changePasswordValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password } = req.body;
            const { id } = req.admin;
            const table = "user_admin";
            const passField = "password";
            const userIdField = "id";
            const schema = "m_hotel_reservation";
            const _e = yield this.commonService.userPasswordVerify({
                table,
                oldPassword: old_password,
                passField,
                userId: id,
                userIdField,
                schema,
            }), { code } = _e, data = __rest(_e, ["code"]);
            if (data.success) {
                const _f = yield this.commonService.changePassword({
                    password: new_password,
                    table,
                    passField,
                    userId: id,
                    userIdField,
                    schema,
                }), { code } = _f, data = __rest(_f, ["code"]);
                res.status(code).json(data);
            }
            else {
                res.status(code).json(data);
            }
        }));
    }
}
exports.default = AdminAuthController;
//# sourceMappingURL=auth.admin.controller.js.map