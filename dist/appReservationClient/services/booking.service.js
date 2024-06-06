"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class URoomBookingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create room booking
    createRoomBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const { id: user_id, hotel_id } = req.hotel_user;
                const { name, email, phone, passport_no, nid_no, city, country, address, postal_code, booking_rooms, check_in_time, check_out_time, discount_amount, total_occupancy, paid_amount, tax_amount, payment_type, ac_tr_ac_id, extra_charge, } = req.body;
                // number of nights step
                const checkInTime = new Date(check_in_time);
                const checkOutTime = new Date(check_out_time);
                const timeDifference = checkOutTime - checkInTime;
                const millisecondsInADay = 24 * 60 * 60 * 1000;
                const numberOfNights = Math.floor(timeDifference / millisecondsInADay);
                // number of nights end
                const clientModel = this.Model.clientModel(trx);
                const roomBookingModel = this.Model.roomBookingModel(trx);
                const checkUser = yield clientModel.getSingleUser({
                    email,
                    hotel_id,
                });
                let userRes;
                if (!checkUser.length) {
                    // create user
                    userRes = yield clientModel.createUser({
                        name,
                        email,
                        hotel_id,
                        nid_no,
                        passport_no,
                        city,
                        country,
                        phone,
                        address,
                        postal_code,
                        user_type: "room-guest",
                    });
                }
                const userID = checkUser.length
                    ? checkUser[0].id
                    : userRes[0];
                // ========== step for amount ============ //
                // room model
                const roomModel = this.Model.RoomModel(trx);
                const bookingRoomsList = booking_rooms.map((item) => item.room_id);
                // get all room by rooms
                const { data: allBookingRoom } = yield roomModel.getAllRoom({
                    hotel_id,
                });
                if (!allBookingRoom.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Room not found with this hotel",
                    };
                }
                // check if unavaiable room or not
                const checkUnavailableRoom = allBookingRoom.filter((item) => !item.availability);
                if (checkUnavailableRoom.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: `This room are unavailable`,
                    };
                }
                const tempAllBokingRoom = [];
                for (let i = 0; i < allBookingRoom.length; i++) {
                    let found = false;
                    for (let j = 0; j < booking_rooms.length; j++) {
                        if (allBookingRoom[i].id === booking_rooms[j].room_id) {
                            found = true;
                            tempAllBokingRoom.push({
                                id: allBookingRoom[i].id,
                                room_number: allBookingRoom[i].room_number,
                                rate_per_night: allBookingRoom[i].rate_per_night,
                            });
                        }
                    }
                    if (!found) {
                        tempAllBokingRoom.push({
                            id: allBookingRoom[i].id,
                            room_number: allBookingRoom[i].room_number,
                            rate_per_night: allBookingRoom[i].rate_per_night,
                        });
                    }
                }
                let totalSubAmount = 0;
                if (tempAllBokingRoom.length) {
                    totalSubAmount = tempAllBokingRoom.reduce((acc, room) => {
                        const ratePerNight = (room.rate_per_night || 0) * numberOfNights;
                        return acc + ratePerNight;
                    }, 0);
                }
                const grandTotal = totalSubAmount + (extra_charge || 0) + tax_amount - discount_amount;
                // =============== step end amount =====================
                // get last booking id
                const checkLastBookingId = yield roomBookingModel.getLastRoomBookingId(hotel_id);
                const lastBookingId = checkLastBookingId.length
                    ? checkLastBookingId[0].id + 1
                    : 1;
                const booking_no = `RB-${new Date().getFullYear()}${lastBookingId}`;
                // insert room booking
                const rmbRes = yield roomBookingModel.insertRoomBooking({
                    hotel_id,
                    check_in_time,
                    check_out_time,
                    number_of_nights: numberOfNights,
                    total_occupancy,
                    status: "pending",
                    user_id: userID,
                    grand_total: grandTotal,
                    booking_no,
                    extra_charge,
                });
                // insert booking rooms
                const BookingRoomPayload = booking_rooms.map((item) => {
                    return {
                        booking_id: rmbRes[0],
                        room_id: item.room_id,
                    };
                });
                yield roomBookingModel.insertBookingRoom(BookingRoomPayload);
                if (paid_amount > 0) {
                    yield roomBookingModel.updateRoomBooking({ pay_status: 1, reserved_room: 1 }, { id: rmbRes[0] });
                }
                //=================== step for invoice ======================//
                let advanceAmount = 0;
                let due_amount = 0;
                if (grandTotal < paid_amount) {
                    advanceAmount = paid_amount - grandTotal;
                }
                else {
                    due_amount = grandTotal - paid_amount;
                }
                // insert in invoice
                const invoiceModel = this.Model.hotelInvoiceModel(trx);
                // get last invoice
                const invoiceData = yield invoiceModel.getAllInvoiceForLastId();
                const year = new Date().getFullYear();
                const InvoiceNo = invoiceData.length ? invoiceData[0].id + 1 : 1;
                // insert invoice
                const invoiceRes = yield invoiceModel.insertHotelInvoice({
                    invoice_no: `OPNL-${year}${InvoiceNo}`,
                    description: `For room booking, booking id =${rmbRes[0]}, ${due_amount
                        ? `due amount is =${due_amount}`
                        : `fully paid amount is = ${grandTotal}`}`,
                    created_by: user_id,
                    discount_amount: discount_amount,
                    grand_total: grandTotal,
                    tax_amount: tax_amount,
                    sub_total: totalSubAmount,
                    due: due_amount,
                    hotel_id,
                    type: "front_desk",
                    user_id: userID,
                });
                // insert invoice item
                const invoiceItem = tempAllBokingRoom.map((item) => {
                    return {
                        invoice_id: invoiceRes[0],
                        name: item.room_number,
                        quantity: 1,
                        total_price: item.rate_per_night,
                    };
                });
                yield invoiceModel.insertHotelInvoiceItem(invoiceItem);
                //=============== Money reciept step ============== //
                if (paid_amount > 0) {
                    // get last money reciept
                    const moneyRecieptData = yield invoiceModel.getAllMoneyRecieptFoLastId();
                    const moneyRecieptNo = moneyRecieptData.length
                        ? moneyRecieptData[0].id + 1
                        : 1;
                    yield invoiceModel.createMoneyReciept({
                        hotel_id,
                        created_by: user_id,
                        user_id: userID,
                        payment_type,
                        total_collected_amount: paid_amount,
                        description: `Money reciept for invoice id = ${invoiceRes[0]},Total amount ${grandTotal} and Total due amount is ${due_amount}`,
                        money_receipt_no: `${payment_type == "bank"
                            ? `ORMBN-${year}-${moneyRecieptNo}`
                            : payment_type == "cash"
                                ? `ORMCS-${year}-${moneyRecieptNo}`
                                : payment_type == "cheque"
                                    ? `ORMCQ-${year}-${moneyRecieptNo}`
                                    : payment_type == "mobile-banking"
                                        ? `ORMMB-${year}-${moneyRecieptNo}`
                                        : ""}`,
                        remarks: "For room booking",
                    });
                }
                // =================== accounting part ============== //
                const accountModel = this.Model.accountModel(trx);
                if (paid_amount > 0) {
                    if (!ac_tr_ac_id) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: "You have to give account transaction id",
                        };
                    }
                    // check account
                    const checkAccount = yield accountModel.getSingleAccount({
                        hotel_id,
                        id: ac_tr_ac_id,
                        type: payment_type,
                    });
                    if (!checkAccount.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Account not found with this id and type",
                        };
                    }
                    // insert account transaction
                    const transactionRes = yield accountModel.insertAccountTransaction({
                        ac_tr_ac_id,
                        ac_tr_cash_in: paid_amount,
                    });
                    // get account ledger by id
                    const ledgerLastBalance = yield accountModel.getAllLedgerLastBalanceByAccount({
                        hotel_id,
                        ledger_account_id: ac_tr_ac_id,
                    });
                    const total_ledger_balance = parseFloat(ledgerLastBalance) + paid_amount;
                    // insert account ledger
                    yield accountModel.insertAccountLedger({
                        ac_tr_id: transactionRes[0],
                        ledger_credit_amount: paid_amount,
                        ledger_details: `Balance has been credited by room booking, Room booking id =${rmbRes[0]}`,
                        ledger_balance: total_ledger_balance,
                    });
                    // update account last balance
                    yield accountModel.upadateSingleAccount({ last_balance: total_ledger_balance }, { hotel_id, id: ac_tr_ac_id });
                    //====== guest balance update ======//
                    if (due_amount) {
                        const lastGuestBalance = ((_a = checkUser[0]) === null || _a === void 0 ? void 0 : _a.last_balance)
                            ? checkUser[0].last_balance
                            : 0;
                        const nowTotalBalance = lastGuestBalance - due_amount;
                        yield clientModel.updateSingleUser({ last_balance: nowTotalBalance }, { hotel_id, id: userID });
                    }
                }
                else {
                    const lastGuestBalance = ((_b = checkUser[0]) === null || _b === void 0 ? void 0 : _b.last_balance)
                        ? checkUser[0].last_balance
                        : 0;
                    const nowTotalBalance = lastGuestBalance - grandTotal;
                    yield clientModel.updateSingleUser({ last_balance: nowTotalBalance }, { hotel_id, id: userID });
                }
                // =========== advance amount =========== //
                if (advanceAmount) {
                    const lastGuestBalance = ((_c = checkUser[0]) === null || _c === void 0 ? void 0 : _c.last_balance)
                        ? checkUser[0].last_balance
                        : 0;
                    const nowTotalBalance = lastGuestBalance + advanceAmount;
                    yield clientModel.updateSingleUser({ last_balance: nowTotalBalance }, { hotel_id, id: userID });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Room Booking Confimed",
                };
            }));
        });
    }
    // get all room booking
    getAllRoomBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_user;
            const { limit, skip, name, status, user_id } = req.query;
            const model = this.Model.clientModel();
            const { data, total } = yield model.getAllRoomBooking({
                limit: limit,
                skip: skip,
                name: name,
                hotel_id,
                status: status,
                user_id: user_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get single room booking
    getSingleRoomBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { hotel_id } = req.hotel_user;
            const data = yield this.Model.clientModel().getSingleRoomBooking(parseInt(id), hotel_id);
            if (!data.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: data,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
}
exports.default = URoomBookingService;
//# sourceMappingURL=booking.service.js.map