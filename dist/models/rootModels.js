"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_Model_1 = __importDefault(require("./ClientModel/client.Model"));
const ReportModel_1 = __importDefault(require("./ReportModel/ReportModel"));
const Room_Model_1 = __importDefault(require("./RoomModel/Room.Model"));
const UserAdmin_model_1 = __importDefault(require("./UserAdminModel/UserAdmin.model"));
const accountModel_1 = __importDefault(require("./accountModel/accountModel"));
const commonModel_1 = __importDefault(require("./commonModel/commonModel"));
const dashBoardModel_1 = __importDefault(require("./dashBoardModel/dashBoardModel"));
const employeeModel_1 = __importDefault(require("./employeeModel/employeeModel"));
const expenseModel_1 = __importDefault(require("./expenseModel/expenseModel"));
const parking_model_1 = __importDefault(require("./fleetManagementModel/parking.model"));
const vehicles_model_1 = __importDefault(require("./fleetManagementModel/vehicles.model"));
const guestModel_1 = __importDefault(require("./guestModel/guestModel"));
const hRolePermissionModel_1 = __importDefault(require("./hRolePermissionModel/hRolePermissionModel"));
const hallBookingInvoiceModel_1 = __importDefault(require("./hallBookingInvoiceModel/hallBookingInvoiceModel"));
const hallBooking_Model_1 = __importDefault(require("./hallBookingModel/hallBooking.Model"));
const hallModel_1 = __importDefault(require("./hallModel/hallModel"));
const hotelAdmin_model_1 = __importDefault(require("./hotelAdmin/hotelAdmin.model"));
const hotelInvoiceModel_1 = __importDefault(require("./hotelInvoiceModel/hotelInvoiceModel"));
const hotel_model_1 = __importDefault(require("./hotelModel/hotel.model"));
const mConfigurationModel_1 = __importDefault(require("./mConfigurationModel/mConfigurationModel"));
const mRolePermissionModel_1 = __importDefault(require("./mRolePermissionModel/mRolePermissionModel"));
const mUserAdmin_model_1 = __importDefault(require("./mUserAdminModel/mUserAdmin.model"));
const payRollModel_1 = __importDefault(require("./payRollModel/payRollModel"));
const restaurant_Model_1 = __importDefault(require("./restaurantModel/restaurant.Model"));
const roomBookingInvoiceModel_1 = __importDefault(require("./roomBookingInvoiceModel/roomBookingInvoiceModel"));
const roomBookingModel_1 = __importDefault(require("./roomBookingModel/roomBookingModel"));
const Setting_Model_1 = __importDefault(require("./settingModel/Setting.Model"));
const fleet_common_model_1 = __importDefault(require("./fleetManagementModel/fleet.common.model"));
const res_admin_role_model_1 = __importDefault(require("./restaurantModel/res.admin.role.model"));
const res_common_model_1 = __importDefault(require("./restaurantModel/res.common.model"));
const res_food_model_1 = __importDefault(require("./restaurantModel/res.food.model"));
const res_order_model_1 = __importDefault(require("./restaurantModel/res.order.model"));
const res_report_model_1 = __importDefault(require("./restaurantModel/res.report.model"));
class Models {
    constructor(db) {
        this.db = db;
    }
    // common models
    commonModel(trx) {
        return new commonModel_1.default(trx || this.db);
    }
    // role permission model
    HotelrolePermissionModel(trx) {
        return new hRolePermissionModel_1.default(trx || this.db);
    }
    // hotel admin model
    hotelAdminModel(trx) {
        return new hotelAdmin_model_1.default(trx || this.db);
    }
    // room model
    RoomModel(trx) {
        return new Room_Model_1.default(trx || this.db);
    }
    // room booking model
    roomBookingModel(trx) {
        return new roomBookingModel_1.default(trx || this.db);
    }
    // invoice model
    hotelInvoiceModel(trx) {
        return new hotelInvoiceModel_1.default(trx || this.db);
    }
    // room booking invoice model
    roomBookingInvoiceModel(trx) {
        return new roomBookingInvoiceModel_1.default(trx || this.db);
    }
    // hall booking invoice model
    hallBookingInvoiceModel(trx) {
        return new hallBookingInvoiceModel_1.default(trx || this.db);
    }
    // room model
    reportModel(trx) {
        return new ReportModel_1.default(trx || this.db);
    }
    // account model
    accountModel(trx) {
        return new accountModel_1.default(trx || this.db);
    }
    // expense model
    expenseModel(trx) {
        return new expenseModel_1.default(trx || this.db);
    }
    // Reservation user admin model
    rUserAdminModel(trx) {
        return new UserAdmin_model_1.default(trx || this.db);
    }
    // Reservation role permission model
    rRolePermissionModel(trx) {
        return new hRolePermissionModel_1.default(trx || this.db);
    }
    // Reservation Setting model
    settingModel(trx) {
        return new Setting_Model_1.default(trx || this.db);
    }
    // hotel user model
    guestModel(trx) {
        return new guestModel_1.default(trx || this.db);
    }
    // hotel employee model
    employeeModel(trx) {
        return new employeeModel_1.default(trx || this.db);
    }
    // hotel employee pay roll
    payRollModel(trx) {
        return new payRollModel_1.default(trx || this.db);
    }
    // hotel hall
    hallModel(trx) {
        return new hallModel_1.default(trx || this.db);
    }
    // hotel hall booking
    hallBookingModel(trx) {
        return new hallBooking_Model_1.default(trx || this.db);
    }
    // DashBoard Model
    dashBoardModel(trx) {
        return new dashBoardModel_1.default(trx || this.db);
    }
    //=============== Fleet Management model Start ================ //
    // Driver, owner
    fleetCommonModel(trx) {
        return new fleet_common_model_1.default(trx || this.db);
    }
    // vehicle, fuel, maintenance, trip
    vehicleModel(trx) {
        return new vehicles_model_1.default(trx || this.db);
    }
    // parking
    parkingModel(trx) {
        return new parking_model_1.default(trx || this.db);
    }
    //=============== Restaurant model start ================ //
    // hotel Restaurant
    restaurantModel(trx) {
        return new restaurant_Model_1.default(trx || this.db);
    }
    // admin role permission
    resAdminRoleModel(trx) {
        return new res_admin_role_model_1.default(trx || this.db);
    }
    // Restaurant, account, expense, invoice, supplier
    resCommonModel(trx) {
        return new res_common_model_1.default(trx || this.db);
    }
    // category, ingredient, purchase, inventory, food
    resFoodModel(trx) {
        return new res_food_model_1.default(trx || this.db);
    }
    // table, order, kitchen
    resOrderModel(trx) {
        return new res_order_model_1.default(trx || this.db);
    }
    // Restaurant Reports
    resReportModel(trx) {
        return new res_report_model_1.default(trx || this.db);
    }
    //=============== client panel model start ================ //
    // hotel hall booking
    clientModel(trx) {
        return new client_Model_1.default(trx || this.db);
    }
    //=============== m360ict panel model start ================ //
    // hotel user model
    HotelModel(trx) {
        return new hotel_model_1.default(trx || this.db);
    }
    // user admin model
    mUserAdminModel(trx) {
        return new mUserAdmin_model_1.default(trx || this.db);
    }
    // configuration model
    mConfigurationModel(trx) {
        return new mConfigurationModel_1.default(trx || this.db);
    }
    // role permission model
    mRolePermissionModel(trx) {
        return new mRolePermissionModel_1.default(trx || this.db);
    }
}
exports.default = Models;
//# sourceMappingURL=rootModels.js.map