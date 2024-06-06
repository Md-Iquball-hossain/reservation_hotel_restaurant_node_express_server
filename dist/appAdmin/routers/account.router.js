"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const account_controller_1 = __importDefault(require("../controllers/account.controller"));
class AccountRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.accountController = new account_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create account and get all account
        this.router
            .route("/")
            .post(this.accountController.createAccount)
            .get(this.accountController.getAllAccount);
        // transfer balance to other account
        this.router
            .route("/balance-transfer")
            .post(this.accountController.balanceTransfer);
        // update account
        this.router.route("/:id").patch(this.accountController.updateAccount);
    }
}
exports.default = AccountRouter;
//# sourceMappingURL=account.router.js.map