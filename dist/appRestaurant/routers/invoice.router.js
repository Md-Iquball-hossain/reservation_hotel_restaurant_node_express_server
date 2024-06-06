"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const invoice_controller_1 = __importDefault(require("../controllers/invoice.controller"));
class InvoiceRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new invoice_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Purchase Router ======================//
        // Invoice
        this.router
            .route("/")
            .get(this.Controller.getAllInvoice);
        // Single Invoice
        this.router.route("/:id")
            .get(this.Controller.getSingleInvoice);
    }
}
exports.default = InvoiceRouter;
//# sourceMappingURL=invoice.router.js.map