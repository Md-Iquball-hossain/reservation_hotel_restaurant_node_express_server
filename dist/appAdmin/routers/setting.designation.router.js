"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const setting_designation_controller_1 = __importDefault(require("../controllers/setting.designation.controller"));
class DesignationSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.designationSettingController = new setting_designation_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Designation Router ======================//
        // Designation
        this.router
            .route("/")
            .post(this.designationSettingController.createDesignation)
            .get(this.designationSettingController.getAllDesignation);
        // edit and remove Designation
        this.router
            .route("/:id")
            .patch(this.designationSettingController.updateDesignation)
            .delete(this.designationSettingController.deleteDesignation);
    }
}
exports.default = DesignationSettingRouter;
//# sourceMappingURL=setting.designation.router.js.map