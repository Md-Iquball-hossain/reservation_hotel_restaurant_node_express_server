"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controller_1 = __importDefault(require("../../abstarcts/abstract.controller"));
const ingredient_service_1 = __importDefault(require("../services/ingredient.service"));
const ingredient_validator_1 = __importDefault(require("../utils/validator/ingredient.validator"));
class IngredientController extends abstract_controller_1.default {
    constructor() {
        super();
        this.Service = new ingredient_service_1.default();
        this.Validator = new ingredient_validator_1.default();
        //=================== Ingredient Controller ======================//
        // create Ingredient
        this.createIngredient = this.asyncWrapper.wrap({ bodySchema: this.Validator.createIngredientValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.Service.createIngredient(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get All Ingredient
        this.getAllIngredient = this.asyncWrapper.wrap({ querySchema: this.Validator.getAllIngredientQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.Service.getAllIngredient(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // update Ingredient
        this.updateIngredient = this.asyncWrapper.wrap({ bodySchema: this.Validator.UpdateIngredientValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.Service.updateIngredient(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // delete Ingredient
        this.deleteIngredient = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.Service.deleteIngredient(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = IngredientController;
//# sourceMappingURL=ingredient.controller.js.map