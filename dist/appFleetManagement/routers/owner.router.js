"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const owner_controller_1 = __importDefault(require("../controllers/owner.controller"));
class OwnerRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new owner_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all owner
        this.router
            .route("/")
            .post(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.createOwner)
            .get(this.Controller.getAllOwner);
        // single and update owner
        this.router
            .route("/:id")
            .get(this.Controller.getSingleOwner)
            .patch(this.uploader
            .cloudUploadRaw(this.fileFolders.FLEET_FILES), this.Controller.updateOwner);
    }
}
exports.default = OwnerRouter;
//# sourceMappingURL=owner.router.js.map