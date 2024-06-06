import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class SalaryExpenseReportService extends AbstractServices {
constructor() {
super();
}

//=================== salary report Service ======================//

    // Get salary report
    public async getSalaryReport(req: Request) {
    const { hotel_id } = req.hotel_admin;
    const { limit, skip, key, from_date, to_date } = req.query;

    const model = this.Model.reportModel();

    const { data, total,totalAmount  } = await model.getSalaryReport({
        limit: limit as string,
        skip: skip as string,
        key: key as string,
        from_date: from_date as string,
        to_date: to_date as string,
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
export default SalaryExpenseReportService;
