import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import AccountService from "../services/account.service";
import AccountValidator from "../utlis/validator/account.validator";

class AccountController extends AbstractController {
  private accountService = new AccountService();
  private accountValidator = new AccountValidator();
  constructor() {
    super();
  }
  // Create Account
  public createAccount = this.asyncWrapper.wrap(
    { bodySchema: this.accountValidator.createAccountValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.accountService.createAccount(req);

      res.status(code).json(data);
    }
  );

  // Get all Account
  public getAllAccount = this.asyncWrapper.wrap(
    { querySchema: this.accountValidator.getAllAccountQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.accountService.getAllAccount(req);
      res.status(code).json(data);
    }
  );

  // Update Account
  public updateAccount = this.asyncWrapper.wrap(
    { bodySchema: this.accountValidator.updateAccountValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.accountService.updateAccount(req);

      res.status(code).json(data);
    }
  );

  // balance transfer
  public balanceTransfer = this.asyncWrapper.wrap(
    { bodySchema: this.accountValidator.balanceTransferValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.accountService.balanceTransfer(req);

      res.status(code).json(data);
    }
  );
}
export default AccountController;
