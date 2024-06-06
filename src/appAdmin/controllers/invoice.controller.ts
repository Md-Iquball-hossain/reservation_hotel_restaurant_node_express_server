import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import InvoiceService from "../services/invoice.service";
import InvoiceValidator from "../utlis/validator/invoice.validator";

class InvoiceController extends AbstractController {
  private invoiceService = new InvoiceService();
  private invoicevalidator = new InvoiceValidator();
  constructor() {
    super();
  }

  // get all invoice controller with filter
  public getAllInvoice = this.asyncWrapper.wrap(
    { querySchema: this.invoicevalidator.getAllInvoiceValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.invoiceService.getAllInvoice(req);
      res.status(code).json(data);
    }
  );

  // get Single invoice Controller
  public getSingleInvoice = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator("invoice_id") },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.invoiceService.getSingleInvoice(req);
      res.status(code).json(data);
    }
  );

  // get all invoice for money reciept
  public getAllInvoiceForMoneyReceipt = this.asyncWrapper.wrap(
    { querySchema: this.invoicevalidator.getAllInvoiceValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.invoiceService.getAllInvoiceForMoneyReceipt(req);
      res.status(code).json(data);
    }
  );

  // create invoice
  public createInvoice = this.asyncWrapper.wrap(
    { bodySchema: this.invoicevalidator.createInvoiceValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.invoiceService.createInvoice(req);
      res.status(code).json(data);
    }
  );

  // get all room booking invoice controller with filter
  public getAllRoomBookingInvoice = this.asyncWrapper.wrap(
    { querySchema: this.invoicevalidator.getAllInvoiceValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.invoiceService.getAllRoomBookingInvoice(req);
      res.status(code).json(data);
    }
  );

  // get Single room booking invoice Controller
  public getSingleRoomBookingInvoice = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator("invoice_id") },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.invoiceService.getSingleRoomBookingInvoice(req);
      res.status(code).json(data);
    }
  );

  // get all hall booking invoice controller with filter
  public getAllHallBookingInvoice = this.asyncWrapper.wrap(
    { querySchema: this.invoicevalidator.getAllInvoiceValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.invoiceService.getAllHallBookingInvoice(req);
      res.status(code).json(data);
    }
  );

  // get Single hall booking invoice Controller
  public getSingleHallBookingInvoice = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator("invoice_id") },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.invoiceService.getSingleHallBookingInvoice(req);
      res.status(code).json(data);
    }
  );
}
export default InvoiceController;
