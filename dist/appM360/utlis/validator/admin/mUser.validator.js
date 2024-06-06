"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MUserValidator {
    constructor() {
        // create user input validator
        this.createUserValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required(),
        });
    }
}
exports.default = MUserValidator;
//# sourceMappingURL=mUser.validator.js.map