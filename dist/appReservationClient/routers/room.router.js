"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
class clientRoomRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.clientRoomController = new room_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get all room
        this.router.route("/")
            .get(this.clientRoomController.getAllHotelRoom);
        // get all available and unavailable room
        this.router
            .route("/available-unavailable")
            .get(this.clientRoomController.getAllAvailableAndUnavailableRoom);
        // get all available room
        this.router
            .route("/available")
            .get(this.clientRoomController.getAllAvailableRoom);
        this.router.route("/:room_id")
            .get(this.clientRoomController.getSingleHotelRoom);
    }
}
exports.default = clientRoomRouter;
//# sourceMappingURL=room.router.js.map