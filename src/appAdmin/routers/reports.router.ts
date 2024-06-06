import AbstractRouter from "../../abstarcts/abstract.router";
import ReportController from "../controllers/report.dashBoard.controller";
import AccountReportRouter from "./report.account.router";
import ClientLegderReportRouter from "./report.client-ledger.router";
import ExpenseReportRouter from "./report.expense.router";
import HallBookingReportRouter from "./report.hall-booking.router";
import RoomBookingReportRouter from "./report.room-booking.router";
import RoomReportRouter from "./report.room.router";
import SalaryExpenseRouter from "./report.salary.router";

class ReportRouter extends AbstractRouter {
  public reportController = new ReportController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // Room Report
    this.router.use("/room", new RoomReportRouter().router);

    // room-Booking Report
    this.router.use("/room-booking", new RoomBookingReportRouter().router);

    // hall-Booking Report
    this.router.use("/hall-booking", new HallBookingReportRouter().router);

    // account report
    this.router.use("/account", new AccountReportRouter().router);

    // expense report
    this.router.use("/expense", new ExpenseReportRouter().router);

    // salary report
    this.router.use("/salary", new SalaryExpenseRouter().router);

    // client-ledger report
    this.router.use("/client-ledger", new ClientLegderReportRouter().router);

    //  dashboard data
    this.router
      .route("/dashboard")
      .get(this.reportController.getDashboardReport);

    //  Amount dashboard data
    this.router
    .route("/amount-dashboard")
    .get(this.reportController.getAmountReport);

    // Account dashboard data
    this.router
    .route("/account-dashboard")
    .get(this.reportController.getAccountReport);

    // Room dashboard data
    this.router
    .route("/room_dashboard")
    .get(this.reportController.getRoomReport);

  }
}
export default ReportRouter;
