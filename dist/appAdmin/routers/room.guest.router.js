"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const guest_controller_1 = __importDefault(require("../controllers/guest.controller"));
class RoomGuestRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.guestController = new guest_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // guest
        this.router.route("/")
            .get(this.guestController.getRoomGuest);
    }
}
exports.default = RoomGuestRouter;
//# sourceMappingURL=room.guest.router.js.map