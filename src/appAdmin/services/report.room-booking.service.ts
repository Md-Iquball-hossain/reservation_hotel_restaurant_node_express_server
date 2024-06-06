import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

export class RoomBookingReportService extends AbstractServices {
    constructor() {
        super();
    }

    // get Hotel Room Booking report Service
    public async getRoomBookingReport(req: Request) {
        const { from_date, to_date, limit, skip, room_id, pay_status } = req.query;
        const { hotel_id } = req.hotel_admin;
        // model
        const model = this.Model.reportModel();

        const {totalAmount,totalGuest, data, total } = await model.getRoomBookingReport({
        room_id: room_id as string,
        pay_status: pay_status as string,
        from_date: from_date as string,
        to_date: to_date as string,
        limit: limit as string,
        skip: skip as string,
        hotel_id,
        });

        return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        total,
        totalAmount,
        totalGuest,
        data,
        };
    }

}

export default RoomBookingReportService;