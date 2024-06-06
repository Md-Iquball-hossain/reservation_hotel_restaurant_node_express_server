"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const migrate_controller_1 = __importDefault(require("../controllers/migrate.controller"));
class MigrateRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new migrate_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // migate room booking invoice items
        this.router
            .route("/invoice-items")
            .post(this.controller.roomBookingInvoiceItems);
        // migate room booking invoice items
        this.router
            .route("/invoice-hall-items")
            .post(this.controller.hallBookingInvoiceItems);
    }
}
exports.default = MigrateRouter;
//# sourceMappingURL=migrate.router.js.map