"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ownersValidator {
    constructor() {
        // create owners
        this.createOwnerValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            phone: joi_1.default.number().required(),
            email: joi_1.default.string().allow("").optional(),
            address: joi_1.default.string().allow("").optional(),
            occupation: joi_1.default.string().allow("").optional(),
            photo: joi_1.default.string().allow("").optional(),
            documents: joi_1.default.string().allow("").optional(),
        });
        // get all owner
        this.getAllOwnerValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            status: joi_1.default.number().allow("").optional(),
        });
        // update owners
        this.updateOwnerValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            email: joi_1.default.string().allow("").optional(),
            phone: joi_1.default.number().allow("").optional(),
            address: joi_1.default.string().allow("").required(),
            occupation: joi_1.default.string().allow("").optional(),
            photo: joi_1.default.string().allow("").optional(),
            documents: joi_1.default.string().allow("").optional(),
            status: joi_1.default.number().valid(0, 1)
        });
    }
}
exports.default = ownersValidator;
//# sourceMappingURL=owner.validator.js.map