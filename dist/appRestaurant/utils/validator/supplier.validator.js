"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class SupplierValidator {
    constructor() {
        // create Supplier validation
        this.createSupplierValidatorValidator = joi_1.default.object({
            name: joi_1.default.string().uppercase().allow("").required(),
            phone: joi_1.default.number().allow("").required(),
        });
        // get all Supplier query validator
        this.getAllSupplierQueryValidator = joi_1.default.object({
            limit: joi_1.default.string().allow("").optional(),
            skip: joi_1.default.string().allow("").optional(),
            name: joi_1.default.string().allow("").optional(),
            status: joi_1.default.string().allow("").optional(),
        });
        // update Supplier validation
        this.UpdateSupplierValidator = joi_1.default.object({
            name: joi_1.default.string().allow("").optional(),
            phone: joi_1.default.number().allow("").optional(),
            status: joi_1.default.number().allow("").optional(),
        });
    }
}
exports.default = SupplierValidator;
//# sourceMappingURL=supplier.validator.js.map