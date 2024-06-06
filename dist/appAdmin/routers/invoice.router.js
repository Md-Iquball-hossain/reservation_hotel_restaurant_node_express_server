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
        this.invoiceController = new invoice_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get all invoice router
        this.router
            .route("/")
            .get(this.invoiceController.getAllInvoice)
            .post(this.invoiceController.createInvoice);
        // get all invoice router
        this.router
            .route("/for/money-receipt")
            .get(this.invoiceController.getAllInvoiceForMoneyReceipt);
        // get all room booking invoice router
        this.router
            .route("/room-booking")
            .get(this.invoiceController.getAllRoomBookingInvoice);
        // get all hall booking invoice router
        this.router
            .route("/hall-booking")
            .get(this.invoiceController.getAllHallBookingInvoice);
        // get single room booking invoice router
        this.router
            .route("/room-booking/:invoice_id")
            .get(this.invoiceController.getSingleRoomBookingInvoice);
        // get single hall booking invoice router
        this.router
            .route("/hall-booking/:invoice_id")
            .get(this.invoiceController.getSingleHallBookingInvoice);
        // get single invoice router
        this.router
            .route("/:invoice_id")
            .get(this.invoiceController.getSingleInvoice);
    }
}
exports.default = InvoiceRouter;
//# sourceMappingURL=invoice.router.js.map