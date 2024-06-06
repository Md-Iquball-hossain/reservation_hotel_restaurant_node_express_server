"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const hotel_controller_1 = __importDefault(require("../controllers/hotel.controller"));
class EmployeeSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.hotelController = new hotel_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get my hotel
        this.router
            .route("/")
            .get(this.hotelController.getMyHotel)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_FILES), this.hotelController.updateMyHotel);
    }
}
exports.default = EmployeeSettingRouter;
//# sourceMappingURL=employeeSetting.router.js.map