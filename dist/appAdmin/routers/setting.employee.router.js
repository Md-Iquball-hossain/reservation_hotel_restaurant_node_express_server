"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstarcts/abstract.router"));
const setting_employee_controller_1 = __importDefault(require("../controllers/setting.employee.controller"));
class EmployeeSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new setting_employee_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all employee
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_EMPLOYEE_FILES), this.controller.createEmployee)
            .get(this.controller.getAllEmployee);
        // update and delete employee profile
        this.router
            .route("/:id")
            .get(this.controller.getSingleEmployee)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders
            .HOTEL_EMPLOYEE_FILES), this.controller.updateEmployee)
            .delete(this.controller.deleteEmployee);
    }
}
exports.default = EmployeeSettingRouter;
//# sourceMappingURL=setting.employee.router.js.map