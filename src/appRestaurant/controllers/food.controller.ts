import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import FoodService from "../services/food.service";
import FoodValidator from "../utils/validator/food.validator";

class FoodController extends AbstractController {
  private Service = new FoodService();
  private Validator = new FoodValidator();
  constructor() {
    super();
  }

  // create Food
  public createFood = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.createFoodValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.createFood(req);

      res.status(code).json(data);
    }
  );

  // get All Food
  public getAllFood = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllFoodQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllFood(req);

      res.status(code).json(data);
    }
  );

  // get single Food
  public getSingleFood = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getSingleFood(req);

      res.status(code).json(data);
    }
  );

  // get All Purchase Ing Item
  public getAllPurchaseIngItem = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllPurchaseIngItem(req);

      res.status(code).json(data);
    }
  );

  // update Food
  public updateFood = this.asyncWrapper.wrap(
    { bodySchema: this.Validator.updateFoodValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.updateFood(req);

      res.status(code).json(data);
    }
  );
}
export default FoodController;
