"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class DashBoardValidator {
    constructor() {
        // Account Report Validator
        this.getAllAmountQueryValidator = joi_1.default.object({
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
        });
        // Account Report Validator
        this.getAllAccountQueryValidator = joi_1.default.object({
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            ac_type: joi_1.default.string().allow("").required(),
        });
        // Room Report Validator
        this.getAllRoomsQueryValidator = joi_1.default.object({
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
        });
    }
}
exports.default = DashBoardValidator;
//# sourceMappingURL=dashboard.validator.js.map