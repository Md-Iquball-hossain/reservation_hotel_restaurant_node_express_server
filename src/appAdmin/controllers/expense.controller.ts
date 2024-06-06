import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ExpenseService from "../services/expense.service";
import ExpenseValidator from "../utlis/validator/expense.validator";

class ExpenseController extends AbstractController {
  private expenseService = new ExpenseService();
  private expensevalidator = new ExpenseValidator();

  constructor() {
    super();
  }

  // Create expense
  public createExpenseHead = this.asyncWrapper.wrap(
    { bodySchema: this.expensevalidator.createExpenseHeadValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.expenseService.createExpenseHead(
        req
      );

      res.status(code).json(data);
    }
  );

  // Get All expense Head
  public getAllExpenseHead = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.expenseService.getAllExpenseHead(
        req
      );

      res.status(code).json(data);
    }
  );

  // Update expense Head
  public updateExpenseHead = this.asyncWrapper.wrap(
    { bodySchema: this.expensevalidator.UpdateExpenseHeadValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.expenseService.updateExpenseHead(
        req
      );

      res.status(code).json(data);
    }
  );

  // Delete expense Head
  public deleteExpenseHead = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.expenseService.deleteExpenseHead(
        req
      );

      res.status(code).json(data);
    }
  );

  // Create expense
  public createExpense = this.asyncWrapper.wrap(
    { bodySchema: this.expensevalidator.createExpenseValidator },
    async (req: Request, res: Response) => {
      const result = await this.expenseService.createExpense(req);

      const { code, ...data } = result;
      res.status(code).json(data);
    }
  );

  // get all expense Controller
  public getAllExpense = this.asyncWrapper.wrap(
    { querySchema: this.expensevalidator.getAllExpenseQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.expenseService.getAllExpense(req);
      res.status(code).json(data);
    }
  );

  // get single expense Controller
  public getSingleExpense = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.expenseService.getSingleExpense(req);

      res.status(code).json(data);
    }
  );

}
export default ExpenseController;
