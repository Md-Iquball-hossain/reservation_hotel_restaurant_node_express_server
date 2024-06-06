"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ownersValidator {
    constructor() {
        // create owners
        this.createOwnersValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().optional(),
            phone: joi_1.default.number().required(),
            address: joi_1.default.string().required(),
            occupation: joi_1.default.string().optional(),
            photo: joi_1.default.string().optional(),
            documents: joi_1.default.string().optional(),
        });
        // get all owners validator
        this.getAllOwnersValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = ownersValidator;
//# sourceMappingURL=owners.validator.js.map