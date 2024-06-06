import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ResReportService from "../services/report.service";
import ResReportValidator from "../utils/validator/report.validator";

class ResReportController extends AbstractController {
  private Service = new ResReportService();
  private Validator = new ResReportValidator();
  constructor() {
    super();
  }

  //=================== Supplier Controller ======================//

  // get Supplier
  public getSupplierLedger = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getSupplierReportValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getSupplierLedger(req);

      res.status(code).json(data);
    }
  );

  // get Purchase
  public getPurchaseReport = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getPurchaseReportValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getPurchaseReport(req);

      res.status(code).json(data);
    }
  );

  // get Food Category
  public getFoodCategoryReport = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getFoodCategoryReportValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getFoodCategoryReport(req);

      res.status(code).json(data);
    }
  );

  // get Sales
  public getSalesReport = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getSalesReportValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getSalesReport(req);

      res.status(code).json(data);
    }
  );

  // get Expense
  public getExpenseReport = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getExpenseReportValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getExpenseReport(req);

      res.status(code).json(data);
    }
  );
}
export default ResReportController;
