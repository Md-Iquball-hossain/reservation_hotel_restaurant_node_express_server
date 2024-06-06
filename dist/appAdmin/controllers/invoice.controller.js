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
const invoice_service_1 = __importDefault(require("../services/invoice.service"));
const invoice_validator_1 = __importDefault(require("../utlis/validator/invoice.validator"));
class InvoiceController extends abstract_controller_1.default {
    constructor() {
        super();
        this.invoiceService = new invoice_service_1.default();
        this.invoicevalidator = new invoice_validator_1.default();
        // get all invoice controller with filter
        this.getAllInvoice = this.asyncWrapper.wrap({ querySchema: this.invoicevalidator.getAllInvoiceValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.invoiceService.getAllInvoice(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get Single invoice Controller
        this.getSingleInvoice = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("invoice_id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.invoiceService.getSingleInvoice(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get all invoice for money reciept
        this.getAllInvoiceForMoneyReceipt = this.asyncWrapper.wrap({ querySchema: this.invoicevalidator.getAllInvoiceValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.invoiceService.getAllInvoiceForMoneyReceipt(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // create invoice
        this.createInvoice = this.asyncWrapper.wrap({ bodySchema: this.invoicevalidator.createInvoiceValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.invoiceService.createInvoice(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get all room booking invoice controller with filter
        this.getAllRoomBookingInvoice = this.asyncWrapper.wrap({ querySchema: this.invoicevalidator.getAllInvoiceValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.invoiceService.getAllRoomBookingInvoice(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get Single room booking invoice Controller
        this.getSingleRoomBookingInvoice = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("invoice_id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.invoiceService.getSingleRoomBookingInvoice(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // get all hall booking invoice controller with filter
        this.getAllHallBookingInvoice = this.asyncWrapper.wrap({ querySchema: this.invoicevalidator.getAllInvoiceValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.invoiceService.getAllHallBookingInvoice(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        // get Single hall booking invoice Controller
        this.getSingleHallBookingInvoice = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("invoice_id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.invoiceService.getSingleHallBookingInvoice(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = InvoiceController;
//# sourceMappingURL=invoice.controller.js.map