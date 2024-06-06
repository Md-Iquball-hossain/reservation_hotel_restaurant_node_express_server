import AbstractRouter from "../../abstarcts/abstract.router";
import DepartmentSettingController from "../controllers/setting.department.controller";

class DepartmentSettingRouter extends AbstractRouter {
    private departmentSettingController = new DepartmentSettingController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Department Router ======================//

        // Department
        this.router
        .route("/")
        .post(this.departmentSettingController.createDepartment)
        .get(this.departmentSettingController.getAllDepartment)

        // edit and remove Department
        this.router
        .route("/:id")
        .patch(this.departmentSettingController.updateDepartment)
        .delete(this.departmentSettingController.deleteDepartment);

    }

}
export default DepartmentSettingRouter;