import AbstractRouter from "../../abstarcts/abstract.router";
import PayrollMonthSettingController from "../controllers/setting.payroll-month.controller";

class PayrollMonthSettingRouter extends AbstractRouter {
    private Controller = new PayrollMonthSettingController();

    constructor() {
        super();
        this.callRouter();
    }

    private callRouter() {

    //=================== Pay Roll Router ======================//

        // pay roll 
        this.router
        .route("/")
        .post(this.Controller.createPayrollMonths)
        .get(this.Controller.getAllPayrollMonths)

        // edit and remove Pay Roll
        this.router
        .route("/:id")
        .patch(this.Controller.updatePayrollMonths)
        .delete(this.Controller.deletePayrollMonths);

    }

}
export default PayrollMonthSettingRouter;