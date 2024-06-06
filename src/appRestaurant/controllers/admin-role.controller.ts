import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import AdministrationResService from "../services/admin-role.service";
import AdministrationResValidator from "../utils/validator/administrator.validator";

class AdministrationResController extends AbstractController {
  private administrationService = new AdministrationResService();
  private administratorValidator = new AdministrationResValidator();
  constructor() {
    super();
  }

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
    {
      bodySchema: this.administratorValidator.createRolePermissionValidator,
    },
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

  // create admin
  public createAdmin = this.asyncWrapper.wrap(
    { bodySchema: this.administratorValidator.createAdminValidator },
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
    { querySchema: this.administratorValidator.getAllAdminQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.getAllAdmin(
        req
      );

      res.status(code).json(data);
    }
  );

  // Update Restaurant Admin
  public updateResAdmin = this.asyncWrapper.wrap(
    { bodySchema: this.administratorValidator.updateRestaurantAdminValidator},
    async (req: Request, res: Response) => {
    const { code, ...data } = await this.administrationService.updateResAdmin(req);

    res.status(code).json(data);
    }
);

  // get All Employee
  public getAllEmployee = this.asyncWrapper.wrap(
    { querySchema: this.administratorValidator.getAllEmployeeQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.administrationService.getAllEmployee(
        req
      );

      res.status(code).json(data);
    }
  );
}

export default AdministrationResController;
