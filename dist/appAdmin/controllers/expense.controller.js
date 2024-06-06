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
const expense_service_1 = __importDefault(require("../services/expense.service"));
const expense_validator_1 = __importDefault(require("../utlis/validator/expense.validator"));
class ExpenseController extends abstract_controller_1.default {
    constructor() {
        super();
        this.expenseService = new expense_service_1.default();
        this.expensevalidator = new expense_validator_1.default();
        // Create expense
        this.createExpenseHead = this.asyncWrapper.wrap({ bodySchema: this.expensevalidator.createExpenseHeadValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.expenseService.createExpenseHead(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // Get All expense Head
        this.getAllExpenseHead = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.expenseService.getAllExpenseHead(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // Update expense Head
        this.updateExpenseHead = this.asyncWrapper.wrap({ bodySchema: this.expensevalidator.UpdateExpenseHeadValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.expenseService.updateExpenseHead(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // Delete expense Head
        this.deleteExpenseHead = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.expenseService.deleteExpenseHead(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // Create expense
        this.createExpense = this.asyncWrapper.wrap({ bodySchema: this.expensevalidator.createExpenseValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.expenseService.createExpense(req);
            const { code } = result, data = __rest(result, ["code"]);
            res.status(code).json(data);
        }));
        // get all expense Controller
        this.getAllExpense = this.asyncWrapper.wrap({ querySchema: this.expensevalidator.getAllExpenseQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.expenseService.getAllExpense(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get single expense Controller
        this.getSingleExpense = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.expenseService.getSingleExpense(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = ExpenseController;
//# sourceMappingURL=expense.controller.js.map