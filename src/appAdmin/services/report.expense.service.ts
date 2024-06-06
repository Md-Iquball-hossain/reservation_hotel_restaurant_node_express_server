import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

export class ExpenseReportService extends AbstractServices {
    constructor() {
        super();
    }

    // get all Expense Report service
    public async getExpenseReport(req: Request) {
        const { hotel_id } = req.hotel_admin;
        const { from_date, to_date, limit, skip, key} = req.query;

        const model = this.Model.reportModel();

        const { data, total,totalAmount } = await model.getExpenseReport({
        from_date: from_date as string,
        to_date: to_date as string,
        limit: limit as string,
        skip: skip as string,
        key: key as string,
        hotel_id,
        });
        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        totalAmount,
        total,
        data,
        };
    }

}
export default ExpenseReportService;