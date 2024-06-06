"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const report_room_controller_1 = __importDefault(require("../controllers/report.room.controller"));
class RoomReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.roomReportController = new report_room_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get room report router
        this.router.route("/").get(this.roomReportController.getRoomReport);
    }
}
exports.default = RoomReportRouter;
//# sourceMappingURL=report.room.router.js.map