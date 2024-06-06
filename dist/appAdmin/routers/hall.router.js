"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const hall_controller_1 = __importDefault(require("../controllers/hall.controller"));
class HallRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.hallController = new hall_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and view hall list
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.HALL_FILES), this.hallController.createHall)
            .get(this.hallController.getAllHall);
        // get all available and unavailable hall
        this.router
            .route("/available-unavailable")
            .get(this.hallController.getAllAvailableAndUnavailableHall);
        // get all available room
        this.router
            .route("/available")
            .get(this.hallController.getAllAvailableHall);
        // Single hall view and edit
        this.router.route("/:hall_id")
            .get(this.hallController.getSingleHall)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.HALL_FILES), this.hallController.updateHall);
    }
}
exports.default = HallRouter;
//# sourceMappingURL=hall.router.js.map