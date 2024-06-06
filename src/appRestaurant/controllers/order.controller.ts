import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ResOrderService from "../services/order.service";
import ResOrderValidator from "../utils/validator/order.validator";

class ResOrderController extends AbstractController {
  private Service = new ResOrderService();
  private validator = new ResOrderValidator();

  constructor() {
    super();
  }

  // Create order
  public createOrder = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createOrderValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.createOrder(req);

      res.status(code).json(data);
    }
  );

  // update order Payment
  public orderPayment = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator(),
      bodySchema: this.validator.orderPaymentValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.OrderPayment(req);

      res.status(code).json(data);
    }
  );

  // get All Order
  public getAllOrder = this.asyncWrapper.wrap(
    { querySchema: this.validator.getAllOrderQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllOrder(req);

      res.status(code).json(data);
    }
  );

  // get single Order
  public getSingleOrder = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator() },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getSingleOrder(req);

      res.status(code).json(data);
    }
  );

  // update order
  public updateOrder = this.asyncWrapper.wrap(
    { bodySchema: this.validator.updateOrderValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.updateOrder(req);

      res.status(code).json(data);
    }
  );

  // get All Kitchen Order
  public getAllKitchenOrder = this.asyncWrapper.wrap(
    { querySchema: this.validator.getAllKitchenQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllKitchenOrder(req);

      res.status(code).json(data);
    }
  );

  // update Kitchen status
  public updateKitchenstatus = this.asyncWrapper.wrap(
    { bodySchema: this.validator.UpdateKitchenStatusValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.updateKitchenStatus(req);

      res.status(code).json(data);
    }
  );

  // Create Table
  public createTable = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createTableValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.createTable(req);

      res.status(code).json(data);
    }
  );

  // get All Table
  public getAllTable = this.asyncWrapper.wrap(
    { querySchema: this.validator.getAllTableValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllTable(req);

      res.status(code).json(data);
    }
  );

  // update Category
  public updateTableName = this.asyncWrapper.wrap(
    { bodySchema: this.validator.UpdateTableNameValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.updateTableName(req);

      res.status(code).json(data);
    }
  );

  // get All Employee
  public getAllEmployee = this.asyncWrapper.wrap(
    { querySchema: this.validator.getAllEmployeeQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllEmployee(req);

      res.status(code).json(data);
    }
  );

  // get all Guest controller with filter
  public getAllGuest = this.asyncWrapper.wrap(
    { querySchema: this.validator.getAllGuestValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.Service.getAllGuest(req);
      res.status(code).json(data);
    }
  );
}
export default ResOrderController;
