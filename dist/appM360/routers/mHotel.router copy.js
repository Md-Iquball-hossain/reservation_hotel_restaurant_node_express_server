"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const mHotel_controller_1 = __importDefault(require("../controllers/mHotel.controller"));
class MHotelRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.hotelController = new mHotel_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create hotel and get all hotel
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_FILES), this.hotelController.createHotel)
            .get(this.hotelController.getAllHotel);
        // get single hotel
        this.router
            .route("/:id")
            .get(this.hotelController.getSingleHotel)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_FILES), this.hotelController.updateHotel);
    }
}
exports.default = MHotelRouter;
//# sourceMappingURL=mHotel.router%20copy.js.map