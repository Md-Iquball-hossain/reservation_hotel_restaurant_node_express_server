"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const paymentMethod_controller_1 = __importDefault(require("../controllers/paymentMethod.controller"));
class BankNameRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new paymentMethod_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Bank Name Router ======================//
        // Bank name create and get
        this.router
            .route("/")
            .post(this.Controller.createBankName)
            .get(this.Controller.getAllBankName);
        // edit and delete Bank name
        this.router
            .route("/:id")
            .patch(this.Controller.updateBanKName)
            .delete(this.Controller.deleteBanKName);
    }
}
exports.default = BankNameRouter;
//# sourceMappingURL=setting.bankname.router.js.map