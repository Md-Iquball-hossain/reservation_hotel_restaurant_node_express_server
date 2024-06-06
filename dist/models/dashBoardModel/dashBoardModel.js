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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class DashBoardModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // invoice due amount
    getAllInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, from_date, to_date } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("inv_view as iv");
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("iv.invoice_id", "iv.due")
                .where("iv.hotel_id", hotel_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("iv.created_at", [from_date, endDate]);
                }
            })
                .orderBy("iv.invoice_id", "desc");
            const total = yield this.db("inv_view as iv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("invoice_id as total")
                .where("iv.hotel_id", hotel_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("iv.created_at", [from_date, endDate]);
                }
            });
            const totalAmount = yield this.db("inv_view as iv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("invoice_id as total")
                .sum("iv.due as totalAmount")
                .where({ hotel_id })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("iv.created_at", [from_date, endDate]);
                }
            });
            return {
                data,
                totalAmount: totalAmount[0].totalAmount,
                total: total[0].total,
            };
        });
    }
    // room booking report
    getRoomBookingReport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, hotel_id } = payload;
            // exact end date
            const endDatePlusOneDay = new Date(to_date);
            endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
            // for ending room booking
            const total_pending_room_booking = yield this.db("room_booking_view as rbv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rbv.id as total_pending_room")
                .where({ hotel_id, status: "pending" })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            // for ending room booking
            const total_rejected_room_booking = yield this.db("room_booking_view as rbv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rbv.id as total_rejected_room")
                .where({ hotel_id, status: "rejected" })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            // for count total
            const total_approved_room_booking = yield this.db("room_booking_view as rbv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rbv.id as total_approved_room")
                .where({ hotel_id, status: "approved" })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            const totalBookingAmount = yield this.db("room_booking_view as rbv")
                .count("rbv.id as total")
                .withSchema(this.RESERVATION_SCHEMA)
                .sum("rbv.grand_total as totalAmount")
                .where({ hotel_id, status: "approved", pay_status: 1 })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            return {
                totalBookingAmount: totalBookingAmount[0].totalAmount,
                total_approved_room_booking: total_approved_room_booking[0].total_approved_room,
                total_rejected_room_booking: total_rejected_room_booking[0].total_rejected_room,
                total_pending_room_booking: total_pending_room_booking[0].total_pending_room,
            };
        });
    }
    // get all hall report
    getHallBookingReport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, from_date, to_date, user_id } = payload;
            const dtbs = this.db("hall_booking_view as hbv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDatePlusOneDay = new Date(to_date);
            endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
            const data = yield dtbs.withSchema(this.RESERVATION_SCHEMA);
            const total_confimed_hall = yield this.db("hall_booking_view as hbv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("hbv.id as total_confimed")
                .where("hbv.hotel_id", hotel_id)
                .andWhere({ booking_status: "confirmed" })
                .andWhere(function () {
                if (user_id) {
                    this.andWhere({ user_id });
                }
                if (from_date && to_date) {
                    this.andWhereBetween("hbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            const total_pending_hall = yield this.db("hall_booking_view as hbv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("hbv.id as total_pending")
                .where("hbv.hotel_id", hotel_id)
                .andWhere({ booking_status: "pending" })
                .andWhere(function () {
                if (user_id) {
                    this.andWhere({ user_id });
                }
                if (from_date && to_date) {
                    this.andWhereBetween("hbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            const total_canceled_hall = yield this.db("hall_booking_view as hbv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("hbv.id as total_canceled")
                .where("hbv.hotel_id", hotel_id)
                .andWhere({ booking_status: "canceled" })
                .andWhere(function () {
                if (user_id) {
                    this.andWhere({ user_id });
                }
                if (from_date && to_date) {
                    this.andWhereBetween("hbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            const totalAmount = yield this.db("hall_booking_view as hbv")
                .count("hbv.id as total")
                .withSchema(this.RESERVATION_SCHEMA)
                .sum("hbv.grand_total as totalAmount")
                .where("hbv.hotel_id", hotel_id)
                .andWhere({ booking_status: "confirmed", pay_status: 1 })
                .andWhere(function () {
                if (user_id) {
                    this.andWhere({ user_id });
                }
                if (from_date && to_date) {
                    this.andWhereBetween("hbv.created_at", [
                        from_date,
                        endDatePlusOneDay,
                    ]);
                }
            });
            return {
                data,
                totalAmount: totalAmount[0].totalAmount,
                total_confimed_hall: total_confimed_hall[0].total_confimed,
                total_pending_hall: total_pending_hall[0].total_pending,
                total_canceled_hall: total_canceled_hall[0].total_canceled,
            };
        });
    }
    // account report
    getAccountReport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ac_type, from_date, hotel_id, to_date } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const total = yield this.db("acc_transaction AS at")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("at.ac_tr_id as total")
                .leftJoin("acc_ledger as al", "at.ac_tr_id", "al.ac_tr_id")
                .leftJoin("account as ac", "at.ac_tr_ac_id", "ac.id")
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("at.ac_tr_date", [from_date, endDate]);
                }
                this.andWhere({ hotel_id });
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
            });
            // total debit amount
            const totalDebitAmount = yield this.db("acc_transaction AS at")
                .withSchema(this.RESERVATION_SCHEMA)
                .sum("al.ledger_debit_amount as totalDebit")
                .leftJoin("acc_ledger as al", "at.ac_tr_id", "al.ac_tr_id")
                .leftJoin("account as ac", "at.ac_tr_ac_id", "ac.id")
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("at.ac_tr_date", [from_date, endDate]);
                }
                this.andWhere({ hotel_id });
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
            });
            // total credit amount
            const totalCreditAmount = yield this.db("acc_transaction AS at")
                .withSchema(this.RESERVATION_SCHEMA)
                .sum("al.ledger_credit_amount as totalCredit")
                .leftJoin("acc_ledger as al", "at.ac_tr_id", "al.ac_tr_id")
                .leftJoin("account as ac", "at.ac_tr_ac_id", "ac.id")
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("at.ac_tr_date", [from_date, endDate]);
                }
                this.andWhere({ hotel_id });
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
            });
            // total total Remainig balance
            const totalRemaining = yield this.db("acc_transaction AS at")
                .withSchema(this.RESERVATION_SCHEMA)
                .sum("ac.last_balance as totalRemaining")
                .leftJoin("acc_ledger as al", "at.ac_tr_id", "al.ac_tr_id")
                .leftJoin("account as ac", "at.ac_tr_ac_id", "ac.id")
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("at.ac_tr_date", [from_date, endDate]);
                }
                this.andWhere({ hotel_id });
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
            });
            return {
                total: total[0].total,
                totalDebitAmount: totalDebitAmount[0].totalDebit | 0,
                totalCreditAmount: totalCreditAmount[0].totalCredit | 0,
                totalRemainingAmount: totalRemaining[0].totalRemaining | 0,
            };
        });
    }
    // room report
    getRoomReport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, hotel_id } = payload;
            // exact end date
            const endDatePlusOneDay = new Date(to_date);
            endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
            const dtbs = this.db("room_view as rv");
            const data = yield dtbs.withSchema(this.RESERVATION_SCHEMA);
            // total room
            const total_room = yield this.db("room_view as rv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rv.room_id as total_room")
                .where({ hotel_id })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rv.created_at", [from_date, endDatePlusOneDay]);
                }
            });
            // total super deluxe room
            const total_super_deluxe_room = yield this.db("room_view as rv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rv.room_id as total_super_deluxe_room")
                .where({ hotel_id, room_type: "super-deluxe" })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rv.created_at", [from_date, endDatePlusOneDay]);
                }
            });
            // total deluxe room
            const total_deluxe_room = yield this.db("room_view as rv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rv.room_id as total_deluxe_room")
                .where({ hotel_id, room_type: "deluxe" })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rv.created_at", [from_date, endDatePlusOneDay]);
                }
            });
            // total single room
            const total_single_room = yield this.db("room_view as rv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rv.room_id as total_single_room")
                .where({ hotel_id, room_type: "single" })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rv.created_at", [from_date, endDatePlusOneDay]);
                }
            });
            // total double room
            const total_double_room = yield this.db("room_view as rv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rv.room_id as total_double_room")
                .where({ hotel_id, room_type: "double" })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("rv.created_at", [from_date, endDatePlusOneDay]);
                }
            });
            return {
                total_room: total_room[0].total_room,
                total_super_deluxe_room: total_super_deluxe_room[0].total_super_deluxe_room,
                total_deluxe_room: total_deluxe_room[0].total_deluxe_room,
                total_single_room: total_single_room[0].total_single_room,
                total_double_room: total_double_room[0].total_double_room,
            };
        });
    }
}
exports.default = DashBoardModel;
//# sourceMappingURL=dashBoardModel.js.map