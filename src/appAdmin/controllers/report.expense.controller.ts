import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ExpenseReportService from "../services/report.expense.service";
import ReportValidator from "../utlis/validator/reports.validator";


class ExpenseReportController extends AbstractController {
    private expenseReportService = new ExpenseReportService();
    private reportvalidator = new ReportValidator();

    constructor() {
        super();
    }

    // get all expense Controller
    public getExpenseReport = this.asyncWrapper.wrap(
        { querySchema: this.reportvalidator.getAllExpenseQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.expenseReportService.getExpenseReport(

            req
        );
        res.status(code).json(data);
        }
    );

}
export default ExpenseReportController;