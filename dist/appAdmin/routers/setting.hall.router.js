"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const setting_hall_controller_1 = __importDefault(require("../controllers/setting.hall.controller"));
class HallSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.hallSettingController = new setting_hall_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Hall Amenities Router ======================//
        // Hall amenities
        this.router
            .route("/amenities")
            .post(this.hallSettingController.createHallAmenities)
            .get(this.hallSettingController.getAllHallAmenities);
        // edit and remove Hall 
        this.router
            .route("/amenities/:id")
            .patch(this.hallSettingController.updateHallAmenities)
            .delete(this.hallSettingController.deleteHallAmenities);
    }
}
exports.default = HallSettingRouter;
//# sourceMappingURL=setting.hall.router.js.map