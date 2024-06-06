import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import SalaryExpenseReportService from "../services/report.salary.service";
import ReportValidator from "../utlis/validator/reports.validator";

class SalaryExpenseReportController extends AbstractController {
private service = new SalaryExpenseReportService();
private salaryReportValidator = new ReportValidator();
constructor() {
    super();
}

// get salary report
public getSalaryReport = this.asyncWrapper.wrap(
    { querySchema: this.salaryReportValidator.getSalaryReportQueryValidator },
    async (req: Request, res: Response) => {
    const { code, ...data } = await this.service.getSalaryReport(req);

    res.status(code).json(data);
    }
);

}
export default SalaryExpenseReportController;
