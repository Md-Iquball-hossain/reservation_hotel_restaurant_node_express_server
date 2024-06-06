import AbstractRouter from "../../abstarcts/abstract.router";
import EmployeeSettingRouter from "./setting.employee.router";
import HotelRouter from "./hotel.router";
import RoomSettingRouter from "./setting.room.router";
import DepartmentSettingRouter from "./setting.department.router";
import DesignationSettingRouter from "./setting.designation.router";
import HallSettingRouter from "./setting.hall.router";
import PayrollMonthSettingRouter from "./setting.payroll-month.router";
import BankNameRouter from "./setting.bankname.router";

class SettingRouter extends AbstractRouter {
  constructor() {
    super();

    this.callRouter();
  }
  private callRouter() {
    // hotel router
    this.router.use("/hotel", new HotelRouter().router);

    // room setting router
    this.router.use("/room", new RoomSettingRouter().router);

    // bank name router
    this.router.use("/bank-name", new BankNameRouter().router);

    // Department setting router
    this.router.use("/department", new DepartmentSettingRouter().router);

    // Designation setting router
    this.router.use("/designation", new DesignationSettingRouter().router);

    // Employee setting router
    this.router.use("/employee", new EmployeeSettingRouter().router);

    // Hall Amenities router
    this.router.use("/hall", new HallSettingRouter().router);

    // Payroll Month router
    this.router.use("/payroll-month", new PayrollMonthSettingRouter().router);

  }
}
export default SettingRouter;
