import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import InventoryService from "../services/inventory.service";
import InventoryValidator from "../utils/validator/inventory.validator";

class InventoryController extends AbstractController {
  private Service = new InventoryService();
  private Validator = new InventoryValidator();
  constructor() {
    super();
  }

  // get All Inventory
  public getAllInventory = this.asyncWrapper.wrap(
    { querySchema: this.Validator.getAllInventoryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getInventoryList(req);

      res.status(code).json(data);
    }
  );
}
export default InventoryController;
