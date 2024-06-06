import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import MAdministrationService from "../services/mAdmin.administration.service";
import MAdministrationValidator from "../utlis/validator/mAdministration.validator";

class MAdministrationController extends AbstractController {
  private administrationService = new MAdministrationService();
  private mAdministratorValidator = new MAdministrationValidator();
  constructor() {
    super();
  }

  public createAdmin = this.asyncWrapper.wrap(
    { bodySchema: this.mAdministratorValidator.createAdminValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.createAdmin(
        req
      );

      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );
  // get all admin
  public getAllAdmin = this.asyncWrapper.wrap(
    { querySchema: this.mAdministratorValidator.getAllAdminQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.getAllAdmin(
        req
      );

      res.status(code).json(data);
    }
  );

  // create permission Group
  public createPermissionGroup = this.asyncWrapper.wrap(
    { bodySchema: this.mAdministratorValidator.createPermissionGroupValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.administrationService.createPermissionGroup(req);

      res.status(code).json(data);
    }
  );

  // get permission group
  public getPermissionGroup = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.administrationService.getPermissionGroup(req);

      res.status(code).json(data);
    }
  );

  // create permission
  public createPermission = this.asyncWrapper.wrap(
    { bodySchema: this.mAdministratorValidator.createPermissionValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.administrationService.createPermission(req);

      res.status(code).json(data);
    }
  );

  // get all permission
  public getAllPermission = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.administrationService.getAllPermission(req);

      res.status(code).json(data);
    }
  );

  // create role
  public createRole = this.asyncWrapper.wrap(
    { bodySchema: this.mAdministratorValidator.createRolePermissionValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.createRole(
        req
      );

      res.status(code).json(data);
    }
  );

  // get role
  public getRole = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.getRole(req);

      res.status(code).json(data);
    }
  );

  // get single role
  public getSingleRole = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.getSingleRole(
        req
      );

      res.status(code).json(data);
    }
  );

  // update single role
  public updateSingleRole = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.administrationService.updateSingleRole(req);

      res.status(code).json(data);
    }
  );

  // get admins role
  public getAdminRole = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.getAdminRole(
        req
      );

      res.status(code).json(data);
    }
  );

  // ======================== restaurant =================== //

  // create permission Group
  public createRestaurantPermissionGroup = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.administrationService.createRestaurantPermissionGroup(req);

      res.status(code).json(data);
    }
  );

  // get permission group
  public getRestaurantPermissionGroup = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.administrationService.getRestaurantPermissionGroup(req);

      res.status(code).json(data);
    }
  );
}

export default MAdministrationController;
