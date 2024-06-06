import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import EmployeeSettingService from "../services/setting.employee.service";
import EmployeeValidator from "../utlis/validator/employee.validator";

class EmployeeSettingController extends AbstractController {
  private service = new EmployeeSettingService();
  private employeeValidator = new EmployeeValidator();
  constructor() {
    super();
  }
  // Create Employee
  public createEmployee = this.asyncWrapper.wrap(
    { bodySchema: this.employeeValidator.createEmployeeValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.createEmployee(req);
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

  // Get all Employee
  public getAllEmployee = this.asyncWrapper.wrap(
    { querySchema: this.employeeValidator.getAllEmployeeQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllEmployee(req);
      res.status(code).json(data);
    }
  );

  // get Single Employee
  public getSingleEmployee = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
    const { code, ...data } = await this.service.getSingleEmployee(req);

    res.status(code).json(data);
    }
  );

  // Update Employee
  public updateEmployee = this.asyncWrapper.wrap(
    { bodySchema: this.employeeValidator.updateEmployeeValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.updateEmployee(req);

      res.status(code).json(data);
      }
  );

  // Delete Employee
  public deleteEmployee = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.deleteEmployee(req);

      res.status(code).json(data);
      }
  );

}
export default EmployeeSettingController;
