import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class InventoryService extends AbstractServices {
  constructor() {
    super();
  }

  // Get all Inventory
  public async getInventoryList(req: Request) {
    const { res_id } = req.rest_user;
    const { limit, skip, key } = req.query;

    const model = this.Model.restaurantModel();

    const { data } = await model.getInventoryList({
      limit: limit as string,
      skip: skip as string,
      key: key as string,
      res_id,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data,
    };
  }
}
export default InventoryService;
