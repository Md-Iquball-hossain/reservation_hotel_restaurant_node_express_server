"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const room_controller_1 = __importDefault(require("../controllers/room.controller"));
class RoomRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.roomController = new room_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create room
        this.router
            .route("/create")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ROOM_FILES), this.roomController.createroom);
        // get all room
        this.router.route("/").get(this.roomController.getAllHotelRoom);
        // get all available and unavailable room
        this.router
            .route("/available-unavailable")
            .get(this.roomController.getAllAvailableAndUnavailableRoom);
        // get all available room
        this.router
            .route("/available")
            .get(this.roomController.getAllAvailableRoom);
        // get Single room
        this.router
            .route("/:room_id")
            .get(this.roomController.getSingleHotelRoom)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.ROOM_FILES), this.roomController.updateHotelRoom);
    }
}
exports.default = RoomRouter;
//# sourceMappingURL=room.router.js.map