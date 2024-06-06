import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ReportService from "../services/report.dashBoard.service";
import DashBoardValidator from "../utlis/validator/dashboard.validator";

class ReportController extends AbstractController {
  private reportService = new ReportService();
  private dashBoardValidator = new DashBoardValidator();
  constructor() {
    super();
  }

  // get dashboard Report
  public getDashboardReport = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.reportService.getDashboardData(req);

      res.status(code).json(data);
    }
  );

  // get Amount Report
  public getAmountReport = this.asyncWrapper.wrap(
    { querySchema: this.dashBoardValidator.getAllAmountQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.reportService.getAmountReport(req);

      res.status(code).json(data);
    }
  );

  // get account Report
  public getAccountReport = this.asyncWrapper.wrap(
    { querySchema: this.dashBoardValidator.getAllAccountQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.reportService.getAccountReport(req);

      res.status(code).json(data);
    }
  );

  // get Room Report
  public getRoomReport = this.asyncWrapper.wrap(
    { querySchema: this.dashBoardValidator.getAllRoomsQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.reportService.getRoomReport(req);

      res.status(code).json(data);
    }
  );
}
export default ReportController;
