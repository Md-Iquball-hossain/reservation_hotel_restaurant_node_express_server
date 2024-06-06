import { Knex } from "knex";
import ClientModel from "./ClientModel/client.Model";
import ReportModel from "./ReportModel/ReportModel";
import RoomModel from "./RoomModel/Room.Model";
import RUserAdminModel from "./UserAdminModel/UserAdmin.model";
import AccountModel from "./accountModel/accountModel";
import CommonModel from "./commonModel/commonModel";
import DashBoardModel from "./dashBoardModel/dashBoardModel";
import EmployeeModel from "./employeeModel/employeeModel";
import ExpenseModel from "./expenseModel/expenseModel";
import ParkingModel from "./fleetManagementModel/parking.model";
import VehiclesModel from "./fleetManagementModel/vehicles.model";
import GuestModel from "./guestModel/guestModel";
import {
  default as HRolePermissionModel,
  default as RolePermissionModel,
} from "./hRolePermissionModel/hRolePermissionModel";
import HallBookingInvoiceModel from "./hallBookingInvoiceModel/hallBookingInvoiceModel";
import HallBookingModel from "./hallBookingModel/hallBooking.Model";
import HallModel from "./hallModel/hallModel";
import HotelAdminModel from "./hotelAdmin/hotelAdmin.model";
import HotelInvoiceModel from "./hotelInvoiceModel/hotelInvoiceModel";
import HotelModel from "./hotelModel/hotel.model";
import MConfigurationModel from "./mConfigurationModel/mConfigurationModel";
import MRolePermissionModel from "./mRolePermissionModel/mRolePermissionModel";
import MUserAdminModel from "./mUserAdminModel/mUserAdmin.model";
import PayRollModel from "./payRollModel/payRollModel";
import RestaurantModel from "./restaurantModel/restaurant.Model";
import RoomBookingInvoiceModel from "./roomBookingInvoiceModel/roomBookingInvoiceModel";
import RoomBookingModel from "./roomBookingModel/roomBookingModel";
import SettingModel from "./settingModel/Setting.Model";
import FleetCommonModel from "./fleetManagementModel/fleet.common.model";
import ResAdminRoleModel from "./restaurantModel/res.admin.role.model";
import ResCommonModel from "./restaurantModel/res.common.model";
import ResFoodModel from "./restaurantModel/res.food.model";
import ResOrderModel from "./restaurantModel/res.order.model";
import ResReportModel from "./restaurantModel/res.report.model";

class Models {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  // common models
  public commonModel(trx?: Knex.Transaction) {
    return new CommonModel(trx || this.db);
  }

  // role permission model
  public HotelrolePermissionModel(trx?: Knex.Transaction) {
    return new HRolePermissionModel(trx || this.db);
  }

  // hotel admin model
  public hotelAdminModel(trx?: Knex.Transaction) {
    return new HotelAdminModel(trx || this.db);
  }

  // room model
  public RoomModel(trx?: Knex.Transaction) {
    return new RoomModel(trx || this.db);
  }

  // room booking model
  public roomBookingModel(trx?: Knex.Transaction) {
    return new RoomBookingModel(trx || this.db);
  }

  // invoice model
  public hotelInvoiceModel(trx?: Knex.Transaction) {
    return new HotelInvoiceModel(trx || this.db);
  }

  // room booking invoice model
  public roomBookingInvoiceModel(trx?: Knex.Transaction) {
    return new RoomBookingInvoiceModel(trx || this.db);
  }

  // hall booking invoice model
  public hallBookingInvoiceModel(trx?: Knex.Transaction) {
    return new HallBookingInvoiceModel(trx || this.db);
  }

  // room model
  public reportModel(trx?: Knex.Transaction) {
    return new ReportModel(trx || this.db);
  }

  // account model
  public accountModel(trx?: Knex.Transaction) {
    return new AccountModel(trx || this.db);
  }

  // expense model
  public expenseModel(trx?: Knex.Transaction) {
    return new ExpenseModel(trx || this.db);
  }

  // Reservation user admin model
  public rUserAdminModel(trx?: Knex.Transaction) {
    return new RUserAdminModel(trx || this.db);
  }

  // Reservation role permission model
  public rRolePermissionModel(trx?: Knex.Transaction) {
    return new RolePermissionModel(trx || this.db);
  }

  // Reservation Setting model
  public settingModel(trx?: Knex.Transaction) {
    return new SettingModel(trx || this.db);
  }

  // hotel user model
  public guestModel(trx?: Knex.Transaction) {
    return new GuestModel(trx || this.db);
  }

  // hotel employee model
  public employeeModel(trx?: Knex.Transaction) {
    return new EmployeeModel(trx || this.db);
  }

  // hotel employee pay roll
  public payRollModel(trx?: Knex.Transaction) {
    return new PayRollModel(trx || this.db);
  }

  // hotel hall
  public hallModel(trx?: Knex.Transaction) {
    return new HallModel(trx || this.db);
  }

  // hotel hall booking
  public hallBookingModel(trx?: Knex.Transaction) {
    return new HallBookingModel(trx || this.db);
  }

  // DashBoard Model
  public dashBoardModel(trx?: Knex.Transaction) {
    return new DashBoardModel(trx || this.db);
  }

  //=============== Fleet Management model Start ================ //

  // Driver, owner
  public fleetCommonModel(trx?: Knex.Transaction) {
    return new FleetCommonModel(trx || this.db);
  }

  // vehicle, fuel, maintenance, trip
  public vehicleModel(trx?: Knex.Transaction) {
    return new VehiclesModel(trx || this.db);
  }

  // parking
  public parkingModel(trx?: Knex.Transaction) {
    return new ParkingModel(trx || this.db);
  }

  //=============== Restaurant model start ================ //

  // hotel Restaurant
  public restaurantModel(trx?: Knex.Transaction) {
    return new RestaurantModel(trx || this.db);
  }

  // admin role permission
  public resAdminRoleModel(trx?: Knex.Transaction) {
    return new ResAdminRoleModel(trx || this.db);
  }

  // Restaurant, account, expense, invoice, supplier
  public  resCommonModel(trx?: Knex.Transaction) {
    return new ResCommonModel(trx || this.db);
  }

  // category, ingredient, purchase, inventory, food
  public resFoodModel(trx?: Knex.Transaction) {
    return new ResFoodModel(trx || this.db);
  }

  // table, order, kitchen
  public resOrderModel(trx?: Knex.Transaction) {
    return new ResOrderModel(trx || this.db);
  }

  // Restaurant Reports
  public resReportModel(trx?: Knex.Transaction) {
    return new ResReportModel(trx || this.db);
  }

  //=============== client panel model start ================ //

  // hotel hall booking
  public clientModel(trx?: Knex.Transaction) {
    return new ClientModel(trx || this.db);
  }

  //=============== m360ict panel model start ================ //

  // hotel user model
  public HotelModel(trx?: Knex.Transaction) {
    return new HotelModel(trx || this.db);
  }

  // user admin model
  public mUserAdminModel(trx?: Knex.Transaction) {
    return new MUserAdminModel(trx || this.db);
  }

  // configuration model
  public mConfigurationModel(trx?: Knex.Transaction) {
    return new MConfigurationModel(trx || this.db);
  }

  // role permission model
  public mRolePermissionModel(trx?: Knex.Transaction) {
    return new MRolePermissionModel(trx || this.db);
  }
}
export default Models;
