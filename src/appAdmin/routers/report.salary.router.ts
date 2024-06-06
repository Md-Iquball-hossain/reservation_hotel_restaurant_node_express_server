import AbstractRouter from "../../abstarcts/abstract.router";
import SalaryExpenseController from "../controllers/report.salary.controller";

class SalaryExpenseRouter extends AbstractRouter {
    private salaryExpenseController;
    constructor() {
        super();
        this.salaryExpenseController = new SalaryExpenseController();
        this.callRouter();
}
    private callRouter() {

    // get salary report
    this.router.route("/").get(this.salaryExpenseController.getSalaryReport);

    }
}
export default SalaryExpenseRouter;