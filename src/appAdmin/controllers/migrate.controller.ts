import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import MigrateService from "../services/migrate.service";

class MigrateController extends AbstractController {
  private service = new MigrateService();

  constructor() {
    super();
  }

  // migate room booking invoice items
  public roomBookingInvoiceItems = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.roomBookingInvoiceItems(req);

      res.status(code).json(data);
    }
  );

  // migate hall booking invoice items
  public hallBookingInvoiceItems = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.hallBookingInvoiceItems(req);

      res.status(code).json(data);
    }
  );

}
export default MigrateController;
