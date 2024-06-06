import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import AccountReportService from "../services/report.account.service";
import ReportValidator from "../utlis/validator/reports.validator";

class AccountReportController extends AbstractController {
  private accountReportService = new AccountReportService();
  private reportValidator = new ReportValidator();
  constructor() {
    super();
  }

  // get account Report
  public getAccountReport = this.asyncWrapper.wrap(
    { querySchema: this.reportValidator.getAllAccountQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.accountReportService.getAccountReport(req);

      res.status(code).json(data);
    }
  );
}
export default AccountReportController;
