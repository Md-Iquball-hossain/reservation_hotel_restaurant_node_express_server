"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class CategoryValidator {
    constructor() {
        // create Category validation
        this.createCategoryValidatorValidator = joi_1.default.object({
            name: joi_1.default.string().uppercase().allow("").required(),
        });
        // get all Category query validator
        this.getAllCategoryQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
        });
        // update Category validation
        this.UpdateCategoryValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            phone: joi_1.default.number().allow("").optional(),
            status: joi_1.default.number().allow("").optional(),
        });
    }
}
exports.default = CategoryValidator;
//# sourceMappingURL=category.validator.js.map