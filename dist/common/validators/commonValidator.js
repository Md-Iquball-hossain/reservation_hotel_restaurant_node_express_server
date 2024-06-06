"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class CommonValidator {
    constructor() {
        // single param validator
        this.singleParamValidator = (idFieldName = "id") => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.number().required();
            return joi_1.default.object(schemaObject);
        };
        // single param string validator
        this.singleParamStringValidator = (idFieldName = "id") => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.string().required();
            return joi_1.default.object(schemaObject);
        };
        // change password validator
        this.changePasswordValidator = joi_1.default.object({
            old_password: joi_1.default.string().required(),
            new_password: joi_1.default.string().required(),
        });
        // forget password validator
        this.forgetPasswordValidator = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            token: joi_1.default.string().required(),
            password: joi_1.default.string().min(8).required(),
        });
        // send email otp validator
        this.sendEmailOtpValidator = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            type: joi_1.default.string()
                .valid("forget_h_admin", "forget_m_admin", "forget_h_user", "forget_r_admin")
                .required(),
        });
        // match email otp validator
        this.matchEmailOtpValidator = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            otp: joi_1.default.string().required(),
            type: joi_1.default.string()
                .valid("forget_h_admin", "forget_m_admin", "forget_h_user", "forget_r_admin")
                .required(),
        });
        // login validator
        this.loginValidator = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required(),
        });
    }
}
exports.default = CommonValidator;
//# sourceMappingURL=commonValidator.js.map