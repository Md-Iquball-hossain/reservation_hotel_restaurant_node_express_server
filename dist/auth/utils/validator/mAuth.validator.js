"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MAuthValidator {
    constructor() {
        // update profile validator
        this.updateProfileValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            phone: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = MAuthValidator;
//# sourceMappingURL=mAuth.validator.js.map