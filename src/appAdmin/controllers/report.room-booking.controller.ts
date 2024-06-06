import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ReportValidator from "../utlis/validator/reports.validator";
import RoomBookingReportService from "../services/report.room-booking.service";

class RoomBookingReportController extends AbstractController {
    private roomBookingReportService = new RoomBookingReportService();
    private reportValidator = new ReportValidator();
    constructor() {
        super();
    }

    // get account Report
    public getRoomBookingReport = this.asyncWrapper.wrap(
        { querySchema: this.reportValidator.getAllHotelRoomBookingQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.roomBookingReportService.getRoomBookingReport(req);

        res.status(code).json(data);
        }
    );
}
export default RoomBookingReportController;
