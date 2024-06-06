"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const paymentMethod_controller_1 = __importDefault(require("../controllers/paymentMethod.controller"));
class PaymentMethodRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.paymentMethodController = new paymentMethod_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Payment Method Name Router ======================//
        // Payment Method name create and view
        this.router
            .route("/payment-method")
            .post(this.paymentMethodController.createPaymentMethod)
            .get(this.paymentMethodController.getAllPaymentMethod);
        // edit and remove Payment Method name
        this.router
            .route("/payment-method/:id")
            .patch(this.paymentMethodController.updatePaymentMethod)
            .delete(this.paymentMethodController.deletePaymentMethod);
    }
}
exports.default = PaymentMethodRouter;
//# sourceMappingURL=paymentMethod.router.js.map