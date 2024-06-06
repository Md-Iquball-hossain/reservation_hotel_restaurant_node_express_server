import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ReportValidator from "../utlis/validator/reports.validator";
import clientLedgerReportService from "../services/report.client-ledger.service";


class ClientLedgerReportController extends AbstractController {
    private Service = new clientLedgerReportService();
    private reportValidator = new ReportValidator();
    constructor() {
        super();
    }

    // get client ledger Report controller
    public getClientLedgerReport = this.asyncWrapper.wrap(
        { querySchema: this.reportValidator.getClientLedgerQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.Service.getClientLedgerReport(req);

        res.status(code).json(data);
        }
    );
}
export default ClientLedgerReportController;