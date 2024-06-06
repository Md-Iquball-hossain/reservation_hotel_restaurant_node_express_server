"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const guest_controller_1 = __importDefault(require("../controllers/guest.controller"));
class GuestRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.guestController = new guest_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // guest
        this.router
            .route("/")
            .post(this.guestController.createGuest)
            .get(this.guestController.getAllGuest);
        // single guest router
        this.router.route("/:user_id").get(this.guestController.getSingleGuest);
        // insert guest ledger
    }
}
exports.default = GuestRouter;
//# sourceMappingURL=guest.router.js.map