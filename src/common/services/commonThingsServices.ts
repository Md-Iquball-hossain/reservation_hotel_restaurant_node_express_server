import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class CommonThingsService extends AbstractServices {
  constructor() {
    super();
  }

  //  ========================= restaurant ======================= //

  // get permission group
  public async getRestaurantPermissionGroup(req: Request) {
    const model = this.Model.restaurantModel();
    const data = await model.getPermissionGroup();

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      data,
    };
  }
}

export default CommonThingsService;
