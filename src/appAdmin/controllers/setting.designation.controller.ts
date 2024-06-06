import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import DesignationSettingService from "../services/setting.designation.service";
import SettingValidator from "../utlis/validator/setting.validator";

class DesignationSettingController extends AbstractController {
  private designationSettingService = new DesignationSettingService();
  private settingValidator = new SettingValidator();
  constructor() {
    super();
  }

  //=================== Designation Controller ======================//

  // Create Designation
  public createDesignation = this.asyncWrapper.wrap(
    { bodySchema: this.settingValidator.createdesignationValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.designationSettingService.createDesignation(req);

      res.status(code).json(data);
    }
  );

  // Get All Designation
  public getAllDesignation = this.asyncWrapper.wrap(
    { querySchema: this.settingValidator.getAlldesignationQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.designationSettingService.getAllDesignation(req);

      res.status(code).json(data);
    }
  );

  // Update Designation
  public updateDesignation = this.asyncWrapper.wrap(
    { bodySchema: this.settingValidator.UpdatedesignationValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.designationSettingService.updateDesignation(req);

      res.status(code).json(data);
    }
  );

  // Delete Designation
  public deleteDesignation = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.designationSettingService.deleteDesignation(req);

      res.status(code).json(data);
    }
  );
}
export default DesignationSettingController;
