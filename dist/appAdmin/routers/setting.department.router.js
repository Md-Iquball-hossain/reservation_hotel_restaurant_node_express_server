"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const setting_department_controller_1 = __importDefault(require("../controllers/setting.department.controller"));
class DepartmentSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.departmentSettingController = new setting_department_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //=================== Department Router ======================//
        // Department
        this.router
            .route("/")
            .post(this.departmentSettingController.createDepartment)
            .get(this.departmentSettingController.getAllDepartment);
        // edit and remove Department
        this.router
            .route("/:id")
            .patch(this.departmentSettingController.updateDepartment)
            .delete(this.departmentSettingController.deleteDepartment);
    }
}
exports.default = DepartmentSettingRouter;
//# sourceMappingURL=setting.department.router.js.map