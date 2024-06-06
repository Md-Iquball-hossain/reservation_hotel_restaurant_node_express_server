import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import MConfigurationService from "../services/mConfiguration.service";
import MConfigurationValidator from "../utlis/validator/mConfiguration.validator";

class MConfigurationController extends AbstractController {
  private service = new MConfigurationService();
  private validator = new MConfigurationValidator();

  constructor() {
    super();
  }
  // create permission Group
  public createPermissionGroup = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createPermissionGroupValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.createPermissionGroup(req);

      res.status(code).json(data);
    }
  );

  // get permission group
  public getPermissionGroup = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getPermissionGroup(req);

      res.status(code).json(data);
    }
  );

  // create permission
  public createPermission = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createPermissionValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.createPermission(req);

      res.status(code).json(data);
    }
  );

  // get single hotel permission
  public getSingleHotelPermission = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getSingleHotelPermission(
        req
      );

      res.status(code).json(data);
    }
  );

  // update single hotel permission
  public updateSingleHotelPermission = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator(),
      bodySchema: this.validator.updatePermissionValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.updateSingleHotelPermission(
        req
      );

      res.status(code).json(data);
    }
  );

  // get all permission
  public getAllPermission = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllPermission(req);

      res.status(code).json(data);
    }
  );
}

export default MConfigurationController;
