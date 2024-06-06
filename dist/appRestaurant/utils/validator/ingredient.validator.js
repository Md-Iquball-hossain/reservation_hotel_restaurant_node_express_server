"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class IngredientValidator {
    constructor() {
        // create Ingredient validation
        this.createIngredientValidator = joi_1.default.object({
            name: joi_1.default.string().uppercase().allow("").required(),
            measurement: joi_1.default.string().uppercase().allow("").required(),
        });
        // get all Ingredient query validator
        this.getAllIngredientQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
        });
        // update Ingredient validation
        this.UpdateIngredientValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            measurement: joi_1.default.string().uppercase().allow("").required(),
        });
        // create Ingredient item validation
        this.createIngredientItemValidator = joi_1.default.object({
            ingredient_id: joi_1.default.string().allow("").required(),
            quantity: joi_1.default.number().allow("").required(),
            price: joi_1.default.number().allow("").required(),
            total: joi_1.default.number().allow("").required(),
        });
    }
}
exports.default = IngredientValidator;
//# sourceMappingURL=ingredient.validator.js.map