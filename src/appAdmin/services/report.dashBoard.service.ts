import { Request } from "express";
import AbstractServices from "../../abstarcts/abstract.service";

class ReportService extends AbstractServices {
  constructor() {
    super();
  }

  public async getDashboardData(req: Request) {
    const { hotel_id } = req.hotel_admin;

    const data = await this.db.raw(
      `CALL ${this.schema.RESERVATION_SCHEMA}.dashboard_data(?)`,
      [hotel_id]
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0][0][0],
    };
  }

  public async getAmountReport(req: Request) {
    const { from_date, to_date } = req.query;
    const { hotel_id } = req.hotel_admin;
    const model = this.Model.reportModel();
    const Dmodel = this.Model.dashBoardModel();

    // Fetch room booking report
    const roomBookingReport = await Dmodel.getRoomBookingReport({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
    });

    // Fetch expense report
    const expenseReport = await model.getExpenseReport({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
    });

    // Fetch salary report
    const salaryReport = await model.getSalaryReport({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
    });

    // Fetch hall booking report
    const hallBookingReport = await Dmodel.getHallBookingReport({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
    });

    // Fetch hall booking report
    const dueInvoiceReport = await Dmodel.getAllInvoice({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
    });

    // Calculate total amount for each report type
    const roomBookingAmount =
      parseFloat(roomBookingReport.totalBookingAmount) || 0;
    const hallBookingAmount = parseFloat(hallBookingReport.totalAmount) || 0;
    const totalDueAmount = parseFloat(dueInvoiceReport.totalAmount) || 0;
    const totalExpense = parseFloat(expenseReport.totalAmount) || 0;
    const SalaryExpense = parseFloat(salaryReport.totalAmount) || 0;
    const total_approved_room_booking =
      roomBookingReport.total_approved_room_booking || 0;
    const total_pending_room_booking =
      roomBookingReport.total_pending_room_booking || 0;
    const total_rejected_room_booking =
      roomBookingReport.total_rejected_room_booking || 0;
    const total_confimed_hall_booking =
      hallBookingReport.total_confimed_hall || 0;
    const total_canceled_hall_booking =
      hallBookingReport.total_canceled_hall || 0;
    const total_pending_hall_booking =
      hallBookingReport.total_pending_hall || 0;

    // Calculate available amount
    const availableAmount =
      roomBookingAmount +
      hallBookingAmount -
      totalDueAmount -
      totalExpense -
      SalaryExpense;

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: {
        roomBookingAmount,
        hallBookingAmount,
        totalDueAmount,
        totalExpense,
        SalaryExpense,
        availableAmount,
        total_approved_room_booking,
        total_pending_room_booking,
        total_rejected_room_booking,
        total_confimed_hall_booking,
        total_pending_hall_booking,
        total_canceled_hall_booking,
      },
    };
  }

  // Dashboard Acount Report
  public async getAccountReport(req: Request) {
    const { from_date, to_date, ac_type } = req.query;
    const { hotel_id } = req.hotel_admin;
    // model
    const model = this.Model.dashBoardModel();

    const { total, totalDebitAmount, totalCreditAmount } =
      await model.getAccountReport({
        from_date: from_date as string,
        to_date: to_date as string,
        hotel_id,
        ac_type: ac_type as string,
      });

    const totalRemainingAmount = totalCreditAmount - totalDebitAmount;

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total,
      totalDebitAmount,
      totalCreditAmount,
      totalRemainingAmount,
    };
  }

  // Dashboard room Report
  public async getRoomReport(req: Request) {
    const { from_date, to_date, ac_type } = req.query;
    const { hotel_id } = req.hotel_admin;
    // model
    const model = this.Model.dashBoardModel();

    const {
      total_room,
      total_super_deluxe_room,
      total_deluxe_room,
      total_double_room,
      total_single_room,
    } = await model.getRoomReport({
      from_date: from_date as string,
      to_date: to_date as string,
      hotel_id,
    });

    const others_room =
      Number(total_room) -
      (Number(total_super_deluxe_room) +
        Number(total_deluxe_room) +
        Number(total_double_room) +
        Number(total_single_room));

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: {
        total_room,
        total_super_deluxe_room,
        total_deluxe_room,
        total_double_room,
        total_single_room,
        others_room,
      },
    };
  }
}
export default ReportService;
