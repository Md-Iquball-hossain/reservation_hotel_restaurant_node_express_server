"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
class RoomImagesRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new room_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // hotel room images
        this.router
            .route("/")
            .get(this.Controller.getAllHotelRoomImages);
    }
}
exports.default = RoomImagesRouter;
//# sourceMappingURL=images.router.js.map