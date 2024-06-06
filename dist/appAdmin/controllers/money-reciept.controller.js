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
const money_reciept_service_1 = __importDefault(require("../services/money-reciept.service"));
const money_reciept_validator_1 = __importDefault(require("../utlis/validator/money-reciept.validator"));
class MoneyRecieptController extends abstract_controller_1.default {
    constructor() {
        super();
        this.moneyRecieptService = new money_reciept_service_1.default();
        this.moneyRecieptValidator = new money_reciept_validator_1.default();
        // create money reciept
        this.createMoneyReciept = this.asyncWrapper.wrap({ bodySchema: this.moneyRecieptValidator.createMoneyReciept }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.moneyRecieptService.createMoneyReciept(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get all money reciept
        this.getAllMoneyReciept = this.asyncWrapper.wrap({ querySchema: this.moneyRecieptValidator.getAllMoneyReciept }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.moneyRecieptService.getAllMoneyReciept(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get single money reciept
        this.getSingleMoneyReciept = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.moneyRecieptService.getSingleMoneyReciept(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // advance return money reciept
        this.advanceReturnMoneyReciept = this.asyncWrapper.wrap({ bodySchema: this.moneyRecieptValidator.advanceReturnMoneyReciept }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.moneyRecieptService.advanceReturnMoneyReciept(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get all advance return money reciept
        this.getAllAdvanceReturnMoneyReciept = this.asyncWrapper.wrap({ querySchema: this.moneyRecieptValidator.getAllAdvanceMoneyReciept }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.moneyRecieptService.getAllAdvanceReturnMoneyReciept(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // single advance return money reciept
        this.getSingleAdvanceReturnMoneyReciept = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.moneyRecieptService.getSingleAdvanceReturnMoneyReciept(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = MoneyRecieptController;
//# sourceMappingURL=money-reciept.controller.js.map