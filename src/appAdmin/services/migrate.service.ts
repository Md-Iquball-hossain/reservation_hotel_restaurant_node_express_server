import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class MigrateService extends AbstractServices {
  constructor() {
    super();
  }

  //=================== migrate Service ======================//

  public async roomBookingInvoiceItems(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id } = req.hotel_admin;

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Migrate successfull.",
      };
    });
  }

  public async hallBookingInvoiceItems(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { hotel_id } = req.hotel_admin;

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: "Migrate successfull.",
      };
    });
  }

}
export default MigrateService;
