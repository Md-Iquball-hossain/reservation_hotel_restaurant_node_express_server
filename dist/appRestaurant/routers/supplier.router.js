"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const supplier_controller_1 = __importDefault(require("../controllers/supplier.controller"));
class SupplierRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new supplier_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Supplier Router ======================//
        // Supplier
        this.router
            .route("/")
            .post(this.Controller.createSupplier)
            .get(this.Controller.getAllSupplier);
        // edit and remove Supplier
        this.router
            .route("/:id")
            .patch(this.Controller.updateSupplier)
            .delete(this.Controller.deleteSupplier);
    }
}
exports.default = SupplierRouter;
//# sourceMappingURL=supplier.router.js.map