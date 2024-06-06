"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const inventory_controller_1 = __importDefault(require("../controllers/inventory.controller"));
class InventoryRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new inventory_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // Inventory
        this.router.route("/").get(this.Controller.getAllInventory);
    }
}
exports.default = InventoryRouter;
//# sourceMappingURL=inventory.router.js.map