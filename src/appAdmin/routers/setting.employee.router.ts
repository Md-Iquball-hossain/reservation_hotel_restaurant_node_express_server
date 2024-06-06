import AbstractRouter from "../../abstarcts/abstract.router";
import EmployeeSettingController from "../controllers/setting.employee.controller";

class EmployeeSettingRouter extends AbstractRouter {
  private controller = new EmployeeSettingController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // create and get all employee
    this.router
      .route("/")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.HOTEL_EMPLOYEE_FILES),
        this.controller.createEmployee
      )
      .get(this.controller.getAllEmployee);

      // update and delete employee profile
      this.router
      .route("/:id")
      .get(this.controller.getSingleEmployee)
      .patch(this.uploader.cloudUploadRaw(this.fileFolders
        .HOTEL_EMPLOYEE_FILES),this.controller.updateEmployee)
      .delete(this.controller.deleteEmployee);

  }
}

export default EmployeeSettingRouter;
