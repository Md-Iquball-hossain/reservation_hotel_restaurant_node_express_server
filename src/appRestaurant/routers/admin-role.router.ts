import AbstractRouter from "../../abstarcts/abstract.router";
import AdministrationResController from "../controllers/admin-role.controller";

class AdministrationResRouter extends AbstractRouter {
  public administratonController;

  constructor() {
    super();
    this.administratonController = new AdministrationResController();
    this.callRouter();
  }

  private callRouter() {
    this.router
      .route("/admin")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.RESTAURANT_FILES),
        this.administratonController.createAdmin
      )
      .get(this.administratonController.getAllAdmin);

    // create permission
    this.router
      .route("/permission")
      .get(this.administratonController.getAllPermission);

    // create role
    this.router
      .route("/role")
      .post(this.administratonController.createRole)
      .get(this.administratonController.getRole);

    // get single role
    this.router
      .route("/role/:id")
      .get(this.administratonController.getSingleRole)
      .patch(this.administratonController.updateSingleRole);

    // get admins role permission
    this.router
      .route("/admin-role-permission")
      .get(this.administratonController.getAdminRole);

    // Get all employee
    this.router
      .route("/employee")
      .get(this.administratonController.getAllEmployee);

    // update admin
    this.router
    .route("/admin/:id")
    .patch(this.administratonController.updateResAdmin);

  }
}

export default AdministrationResRouter;
