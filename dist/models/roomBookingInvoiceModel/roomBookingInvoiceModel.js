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
class RoomBookingInvoiceModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Get all room booking invoice
    getAllRoomBookingInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, user_id, from_date, to_date, limit, skip, due_inovice, } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("room_booking_invoice_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("id as invoice_id", "user_id", "room_booking_id", "user_name", "invoice_no", "type", "discount_amount", "tax_amount", "sub_total", "grand_total", "due", "description", "created_at", "created_by_name")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("invoice_no", "like", `%${key}%`).orWhere("user_name", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (user_id) {
                    this.andWhere("user_id", user_id);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("created_at", [from_date, endDate]);
                }
                if (due_inovice) {
                    this.andWhere("due", ">", 0);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("room_booking_invoice_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("id as total")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("invoice_no", "like", `%${key}%`).orWhere("user_name", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (user_id) {
                    this.andWhere("user_id", user_id);
                }
                if (due_inovice) {
                    this.andWhere("due", ">", 0);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Get single room booking invoice
    getSingleRoomBookingInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, invoice_id, user_id, room_booking_id } = payload;
            return yield this.db("room_booking_invoice_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where({ hotel_id })
                .andWhere(function () {
                if (user_id) {
                    this.andWhere({ user_id });
                }
                if (invoice_id) {
                    this.andWhere({ id: invoice_id });
                }
                if (room_booking_id) {
                    this.andWhere({ room_booking_id });
                }
            });
        });
    }
    // get all room booking invoice for last id
    getAllRoomBookingInvoiceForLastId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking_invoice")
                .select("id")
                .withSchema(this.RESERVATION_SCHEMA)
                .orderBy("id", "desc")
                .limit(1);
        });
    }
    //   insert room booking invoice
    insertRoomBookingInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking_invoice")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    //   insert room booking sub invoice
    insertRoomBookingSubInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking_sub_invoice")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    //   insert room booking sub invoice item
    insertRoomBookingSubInvoiceItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking_sub_invoice_item")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // update room booking sub invoice
    updateRoomBookingSubInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking_sub_invoice")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload);
        });
    }
    //  update room booking sub invoice item
    updateRoomBookingSubInvoiceItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking_sub_invoice_item")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload);
        });
    }
}
exports.default = RoomBookingInvoiceModel;
//# sourceMappingURL=roomBookingInvoiceModel.js.map