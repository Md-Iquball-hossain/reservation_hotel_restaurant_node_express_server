"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class FoodValidator {
    constructor() {
        // create Food validation
        this.createFoodValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            category_id: joi_1.default.number().required(),
            production_price: joi_1.default.number().optional(),
            retail_price: joi_1.default.number().required(),
            food_items: joi_1.default.array()
                .items(joi_1.default.object({
                ingredient_id: joi_1.default.number().required(),
                ing_quantity: joi_1.default.number().required(),
            }))
                .required(),
        });
        // get all Food query validator
        this.getAllFoodQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            key: joi_1.default.string().allow("").optional(),
            category: joi_1.default.string().allow("").optional(),
        });
        // update Food validation
        this.updateFoodValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").required(),
            category_id: joi_1.default.number().allow("").required(),
            inc_quantity: joi_1.default.number().allow("").optional(),
            dec_quantity: joi_1.default.number().allow("").optional(),
            ava_quantity: joi_1.default.number().allow("").optional(),
            retail_price: joi_1.default.number().allow("").optional(),
            status: joi_1.default.number().allow("").optional(),
        });
    }
}
exports.default = FoodValidator;
//# sourceMappingURL=food.validator.js.map