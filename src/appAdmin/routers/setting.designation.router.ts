import AbstractRouter from "../../abstarcts/abstract.router";
import DesignationSettingController from "../controllers/setting.designation.controller";

class DesignationSettingRouter extends AbstractRouter {
    private designationSettingController = new DesignationSettingController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Designation Router ======================//

        // Designation
        this.router
        .route("/")
        .post(this.designationSettingController.createDesignation)
        .get(this.designationSettingController.getAllDesignation)

        // edit and remove Designation
        this.router
        .route("/:id")
        .patch(this.designationSettingController.updateDesignation)
        .delete(this.designationSettingController.deleteDesignation);

    }

}
export default DesignationSettingRouter;