import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

export class clientLedgerReportService extends AbstractServices {
    constructor() {
        super();
    }

    public async getClientLedgerReport(req: Request) {
        const { from_date, to_date, limit, skip, pay_type, user_id} = req.query;
        const { hotel_id } = req.hotel_admin;
        // model
        const model = this.Model.reportModel();

        const {totalAmount, data, total } = await model.getClientLedgerReport({
        from_date: from_date as string,
        to_date: to_date as string,
        limit: limit as string,
        skip: skip as string,
        user_id: user_id as string,
        pay_type: pay_type as  string,
        hotel_id,
        });

        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        totalAmount,
        data,
        };
    }
}

export default clientLedgerReportService;