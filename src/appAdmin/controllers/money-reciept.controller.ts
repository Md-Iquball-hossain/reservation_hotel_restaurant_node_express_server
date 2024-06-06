import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import MoneyRecieptService from "../services/money-reciept.service";
import MoneyRecieptValidator from "../utlis/validator/money-reciept.validator";

class MoneyRecieptController extends AbstractController {
  private moneyRecieptService = new MoneyRecieptService();
  private moneyRecieptValidator = new MoneyRecieptValidator();
  constructor() {
    super();
  }

  // create money reciept
  public createMoneyReciept = this.asyncWrapper.wrap(
    { bodySchema: this.moneyRecieptValidator.createMoneyReciept },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.moneyRecieptService.createMoneyReciept(req);
      res.status(code).json(data);
    }
  );

  // get all money reciept
  public getAllMoneyReciept = this.asyncWrapper.wrap(
    { querySchema: this.moneyRecieptValidator.getAllMoneyReciept },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.moneyRecieptService.getAllMoneyReciept(req);
      res.status(code).json(data);
    }
  );

  // get single money reciept
  public getSingleMoneyReciept = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.moneyRecieptService.getSingleMoneyReciept(req);
      res.status(code).json(data);
    }
  );

  // advance return money reciept
  public advanceReturnMoneyReciept = this.asyncWrapper.wrap(
    { bodySchema: this.moneyRecieptValidator.advanceReturnMoneyReciept },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.moneyRecieptService.advanceReturnMoneyReciept(req);
      res.status(code).json(data);
    }
  );

  // get all advance return money reciept
  public getAllAdvanceReturnMoneyReciept = this.asyncWrapper.wrap(
    { querySchema: this.moneyRecieptValidator.getAllAdvanceMoneyReciept },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.moneyRecieptService.getAllAdvanceReturnMoneyReciept(req);
      res.status(code).json(data);
    }
  );
  // single advance return money reciept
  public getSingleAdvanceReturnMoneyReciept = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.moneyRecieptService.getSingleAdvanceReturnMoneyReciept(req);
      res.status(code).json(data);
    }
  );
}

export default MoneyRecieptController;
