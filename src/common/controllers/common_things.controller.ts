import { Request, Response } from "express";
import CommonAbstractController from "../commonAbstract/common.abstract.controller";
import CommonThingsService from "../services/commonThingsServices";

class CommonThingsController extends CommonAbstractController {
  private commonService = new CommonThingsService();
  constructor() {
    super();
  }

  // get permission group
  public getRestaurantPermissionGroup = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.commonService.getRestaurantPermissionGroup(req);

      res.status(code).json(data);
    }
  );
}

export default CommonThingsController;
