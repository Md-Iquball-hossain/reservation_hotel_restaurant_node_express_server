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
const order_service_1 = __importDefault(require("../services/order.service"));
const order_validator_1 = __importDefault(require("../utils/validator/order.validator"));
class ResOrderController extends abstract_controller_1.default {
    constructor() {
        super();
        this.Service = new order_service_1.default();
        this.validator = new order_validator_1.default();
        // Create order
        this.createOrder = this.asyncWrapper.wrap({ bodySchema: this.validator.createOrderValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.Service.createOrder(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // update order Payment
        this.orderPayment = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator(),
            bodySchema: this.validator.orderPaymentValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.Service.OrderPayment(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get All Order
        this.getAllOrder = this.asyncWrapper.wrap({ querySchema: this.validator.getAllOrderQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.Service.getAllOrder(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // get single Order
        this.getSingleOrder = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.Service.getSingleOrder(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // update order
        this.updateOrder = this.asyncWrapper.wrap({ bodySchema: this.validator.updateOrderValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.Service.updateOrder(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get All Kitchen Order
        this.getAllKitchenOrder = this.asyncWrapper.wrap({ querySchema: this.validator.getAllKitchenQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.Service.getAllKitchenOrder(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // update Kitchen status
        this.updateKitchenstatus = this.asyncWrapper.wrap({ bodySchema: this.validator.UpdateKitchenStatusValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.Service.updateKitchenStatus(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        // Create Table
        this.createTable = this.asyncWrapper.wrap({ bodySchema: this.validator.createTableValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.Service.createTable(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        // get All Table
        this.getAllTable = this.asyncWrapper.wrap({ querySchema: this.validator.getAllTableValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.Service.getAllTable(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        // update Category
        this.updateTableName = this.asyncWrapper.wrap({ bodySchema: this.validator.UpdateTableNameValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.Service.updateTableName(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        // get All Employee
        this.getAllEmployee = this.asyncWrapper.wrap({ querySchema: this.validator.getAllEmployeeQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.Service.getAllEmployee(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        // get all Guest controller with filter
        this.getAllGuest = this.asyncWrapper.wrap({ querySchema: this.validator.getAllGuestValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.Service.getAllGuest(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = ResOrderController;
//# sourceMappingURL=order.controller.js.map