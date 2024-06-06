"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const money_reciept_controller_1 = __importDefault(require("../controllers/money-reciept.controller"));
class MoneyRecieptRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.moneyRecieptController = new money_reciept_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all money reciept
        this.router
            .route("/")
            .post(this.moneyRecieptController.createMoneyReciept)
            .get(this.moneyRecieptController.getAllMoneyReciept);
        // advance money return
        this.router
            .route("/advance-return")
            .post(this.moneyRecieptController.advanceReturnMoneyReciept)
            .get(this.moneyRecieptController.getAllAdvanceReturnMoneyReciept);
        // single advance return
        this.router
            .route("/advance-return/:id")
            .get(this.moneyRecieptController.getSingleAdvanceReturnMoneyReciept);
        // single money reciept
        this.router
            .route("/:id")
            .get(this.moneyRecieptController.getSingleMoneyReciept);
    }
}
exports.default = MoneyRecieptRouter;
//# sourceMappingURL=money-reciept.router.js.map