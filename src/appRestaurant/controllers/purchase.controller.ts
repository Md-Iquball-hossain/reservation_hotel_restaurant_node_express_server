import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import PurchaseService from "../services/purchase.service";
import PurchaseValidator from "../utils/validator/purchase.validator";

class PurchaseController extends AbstractController {
  private Service = new PurchaseService();
  private Validator = new PurchaseValidator();
  constructor() {
    super();
  }

  // create Purchase
  public createPurchase = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createPurchaseValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.createPurchase(req);

      res.status(code).json(data);
    }
  );

  // get All Purchase
  public getAllPurchase = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllPurchaseQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllPurchase(req);

      res.status(code).json(data);
    }
  );

  // get All Account
  public getAllAccount = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllAccountQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllAccount(req);

      res.status(code).json(data);
    }
  );

  // get single Purchase
  public getSinglePurchase = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getSinglePurchase(req);

      res.status(code).json(data);
    }
  );
}
export default PurchaseController;
