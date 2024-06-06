import { Request, Response } from "express";
import AbstractController from "../../abstarcts/abstract.controller";
import ReportValidator from "../utlis/validator/reports.validator";
import RoomReportService from "../services/report.room.service";


class RoomReportController extends AbstractController {
    private roomReportService = new RoomReportService();
    private reportValidator = new ReportValidator();
    constructor() {
        super();
    }

    // get room Report
    public getRoomReport = this.asyncWrapper.wrap(
        { querySchema: this.reportValidator.getAllHotelRoomQueryValidator },
        async (req: Request, res: Response) => {
        const { code, ...data } = await this.roomReportService.getRoomReport(req);

        res.status(code).json(data);
        }
    );

}
export default RoomReportController;
