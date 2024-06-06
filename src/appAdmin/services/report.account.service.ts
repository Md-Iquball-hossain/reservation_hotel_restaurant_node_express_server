import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

export class AccountReportService extends AbstractServices {
  constructor() {
    super();
  }

  // get account report
  public async getAccountReport(req: Request) {
  const { from_date, to_date, name, limit, skip } = req.query;
  const { hotel_id } = req.hotel_admin;
  // model
  const model = this.Model.reportModel();

  const { data, total, totalDebitAmount, totalCreditAmount } =
    await model.getAccountReport({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
      name: name as string,
      limit: limit as string,
      skip: skip as string,
    });

  return {
    success: true,
    code: this.StatusCode.HTTP_OK,
    total,
    totalDebitAmount,
    totalCreditAmount,
    data,
  };
  }

}
export default AccountReportService;
