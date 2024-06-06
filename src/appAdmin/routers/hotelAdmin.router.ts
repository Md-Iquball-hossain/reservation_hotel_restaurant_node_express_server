import { Router } from "express";
import AuthChecker from "../../common/middleware/authChecker/authChecker";
import SettingRouter from "./setting.router";
import RoomBookingRouter from "./room-booking.router";
import RoomRouter from "./room.router";
import MoneyRecieptRouter from "./money-reciept.router";
import ReportRouter from "./reports.router";
import AccountRouter from "./account.router";
import AdministrationRouter from "./administration.router";
import InvoiceRouter from "./invoice.router";
import GuestRouter from "./guest.router";
import ExpenseRouter from "./expense.router";
import PayRollRouter from "./payRoll.router";
import HallRouter from "./hall.router";
import HallBookingRouter from "./hall-booking.router";
import HallGuestRouter from "./hall.guest.router";
import HallCheckinRouter from "./hall-checkin.router";
import RoomGuestRouter from "./room.guest.router";
import MigrateRouter from "./migrate.router";
import CreateRestaurantRouter from "./restaurant.hotel.router";
import hotelRestaurantRouter from "./restaurant.hotel.router";
import FleetRouter from "../../appFleetManagement/routers/fleet.router";

class HotelAdminRouter {
  public hAdminRouter = Router();
  public authChecker = new AuthChecker();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // room booking router
    this.hAdminRouter.use(
      "/room-booking",
      this.authChecker.hotelAdminAuthChecker,
      new RoomBookingRouter().router
    );

    // setting router
    this.hAdminRouter.use(
      "/setting",
      this.authChecker.hotelAdminAuthChecker,
      new SettingRouter().router
    );

    // room router
    this.hAdminRouter.use(
      "/room",
      this.authChecker.hotelAdminAuthChecker,
      new RoomRouter().router
    );

    // Hall router
    this.hAdminRouter.use(
      "/hall",
      this.authChecker.hotelAdminAuthChecker,
      new HallRouter().router
    );

    // Hall booking router
    this.hAdminRouter.use(
      "/hall-booking",
      this.authChecker.hotelAdminAuthChecker,
      new HallBookingRouter().router
    );

    // Hall Check in router
    this.hAdminRouter.use(
      "/hall-check-in",
      this.authChecker.hotelAdminAuthChecker,
      new HallCheckinRouter().router
    );

    // Report router
    this.hAdminRouter.use(
      "/report",
      this.authChecker.hotelAdminAuthChecker,
      new ReportRouter().router
    );

    // administration router
    this.hAdminRouter.use(
      "/administration",
      this.authChecker.hotelAdminAuthChecker,
      new AdministrationRouter().router
    );

    // money reciept router
    this.hAdminRouter.use(
      "/money-reciept",
      this.authChecker.hotelAdminAuthChecker,
      new MoneyRecieptRouter().router
    );

    // account router
    this.hAdminRouter.use(
      "/account",
      this.authChecker.hotelAdminAuthChecker,
      new AccountRouter().router
    );

    // account router
    this.hAdminRouter.use(
      "/invoice",
      this.authChecker.hotelAdminAuthChecker,
      new InvoiceRouter().router
    );

    // Expense router
    this.hAdminRouter.use(
      "/expense",
      this.authChecker.hotelAdminAuthChecker,
      new ExpenseRouter().router
    );

    // Guest router
    this.hAdminRouter.use(
      "/guest",
      this.authChecker.hotelAdminAuthChecker,
      new GuestRouter().router
    );

    // hall Booking Guest
    this.hAdminRouter.use(
      "/hall-guest",
      this.authChecker.hotelAdminAuthChecker,
      new HallGuestRouter().router
    );

    // room Booking Guest
    this.hAdminRouter.use(
      "/room-guest",
      this.authChecker.hotelAdminAuthChecker,
      new RoomGuestRouter().router
    );

    // Guest router
    this.hAdminRouter.use(
      "/payroll",
      this.authChecker.hotelAdminAuthChecker,
      new PayRollRouter().router
    );

    // restaurant router
    this.hAdminRouter.use(
      "/restaurant",
      this.authChecker.hotelAdminAuthChecker,
      new hotelRestaurantRouter().router
    );

    // fleet router
    this.hAdminRouter.use(
      "/fleet",
      this.authChecker.hotelAdminAuthChecker,
      new FleetRouter().router
    );

    // data migrate router
    this.hAdminRouter.use(
      "/migrate",
      this.authChecker.hotelAdminAuthChecker,
      new MigrateRouter().router
    );
  }
}
export default HotelAdminRouter;
