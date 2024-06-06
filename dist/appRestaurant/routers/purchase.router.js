"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const purchase_controller_1 = __importDefault(require("../controllers/purchase.controller"));
class PurchaseRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new purchase_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create purchase and get all purchase
        this.router
            .route("/")
            .post(this.Controller.createPurchase)
            .get(this.Controller.getAllPurchase);
        // Single Purchase
        this.router.route("/:id").get(this.Controller.getSinglePurchase);
    }
}
exports.default = PurchaseRouter;
//# sourceMappingURL=purchase.router.js.map