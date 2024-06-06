import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ReportValidator from "../utlis/validator/reports.validator";
import HallBookingReportService from "../services/report.hall_booking.service";


class HallBookingReportController extends AbstractController {
    private hallBookingReportService = new HallBookingReportService();
    private reportValidator = new ReportValidator();
    constructor() {
        super();
    }

    // get hall booking Report controller
    public getHallBookingReport = this.asyncWrapper.wrap(
        { querySchema: this.reportValidator.getHallBookingQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.hallBookingReportService.getHallBookingReport(req);

        res.status(code).json(data);
        }
    );
}
export default HallBookingReportController;
