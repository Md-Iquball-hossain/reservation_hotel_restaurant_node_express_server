"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const payRoll_controller_1 = __importDefault(require("../controllers/payRoll.controller"));
class PayRollRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new payRoll_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all PayRoll
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_PAYROLL_FILES), this.controller.createPayRoll)
            .get(this.controller.getAllPayRoll);
        // update and delete pay roll
        this.router
            .route("/:id")
            .get(this.controller.getSinglePayRoll);
    }
}
exports.default = PayRollRouter;
//# sourceMappingURL=payRoll.router%20copy.js.map