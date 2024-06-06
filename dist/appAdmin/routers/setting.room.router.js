"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const setting_room_controller_1 = __importDefault(require("../controllers/setting.room.controller"));
class RoomSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.roomSettingController = new setting_room_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Room Type Router ======================//
        // room type
        this.router
            .route("/room-type")
            .post(this.roomSettingController.createRoomType)
            .get(this.roomSettingController.getAllRoomType);
        // edit and remove room type
        this.router
            .route("/room-type/:id")
            .patch(this.roomSettingController.updateRoomType)
            .delete(this.roomSettingController.deleteRoomType);
        //=================== Bed Type Router ======================//
        // bed type
        this.router
            .route("/bed-type")
            .post(this.roomSettingController.createBedType)
            .get(this.roomSettingController.getAllBedType);
        // edit and remove bed type
        this.router
            .route("/bed-type/:id")
            .patch(this.roomSettingController.updateBedType)
            .delete(this.roomSettingController.deleteBedType);
        //=================== Amenities Type Router ======================//
        // room amenities
        this.router
            .route("/room-amenities")
            .post(this.roomSettingController.createRoomAmenities)
            .get(this.roomSettingController.getAllRoomAmenities);
        // edit and remove bed type
        this.router
            .route("/room-amenities/:id")
            .patch(this.roomSettingController.updateRoomAmenities)
            .delete(this.roomSettingController.deleteRoomAmenities);
    }
}
exports.default = RoomSettingRouter;
//# sourceMappingURL=setting.room.router.js.map