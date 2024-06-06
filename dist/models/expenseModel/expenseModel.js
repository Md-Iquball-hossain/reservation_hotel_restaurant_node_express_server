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
class ExpenseModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create Expense Head Model
    createExpenseHead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense_head")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Expense Head Model
    getAllExpenseHead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, name } = payload;
            const dtbs = this.db("expense_head as eh");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("eh.id", "eh.name")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("eh.name", "like", `%${name}%`);
                }
            })
                .orderBy("eh.id", "desc");
            const total = yield this.db("expense_head as eh")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("eh.id as total")
                .where("eh.hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("eh.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Expense Head Model
    updateExpenseHead(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const expenseHeadUpdate = yield this.db("expense_head")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
            return expenseHeadUpdate;
        });
    }
    // Delete Expense Head Model
    deleteExpenseHead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense_head")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
    // Create Expense Model
    createExpense(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // create expense item
    createExpenseItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense_item")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get all voucher last id
    getAllIVoucherForLastId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense")
                .select("id")
                .withSchema(this.RESERVATION_SCHEMA)
                .orderBy("id", "desc")
                .limit(1);
        });
    }
    // get All Expense Model
    getAllExpense(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, from_date, to_date, key } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("expense_view as ev");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("ev.id", "ev.voucher_no", "ev.ac_tr_ac_id as account_id", "ev.expense_date as expense_date", "ev.name as expense_name", "a.name as account_name", "a.ac_type", "ev.total as expense_amount", "ev.created_at", "ev.expense_items")
                .where("ev.hotel_id", hotel_id)
                .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("ev.expense_date", [from_date, endDate]);
                }
                if (key) {
                    this.andWhere((builder) => {
                        builder
                            .orWhere("ev.name", "like", `%${key}%`)
                            .orWhere("a.name", "like", `%${key}%`);
                    });
                }
            })
                .groupBy("ev.id")
                .orderBy("ev.id", "desc");
            const total = yield this.db("expense_view as ev")
                .withSchema(this.RESERVATION_SCHEMA)
                .countDistinct("ev.id as total")
                .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
                .where("ev.hotel_id", hotel_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("ev.expense_date", [from_date, endDate]);
                }
                if (key) {
                    this.andWhere((builder) => {
                        builder
                            .orWhere("ev.name", "like", `%${key}%`)
                            .orWhere("a.name", "like", `%${key}%`);
                    });
                }
            })
                .first();
            return { data, total: total ? total.total : 0 };
        });
    }
    // get single Expense Model
    getSingleExpense(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("expense_view as ev");
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("ev.id", "ev.hotel_id", "ev.voucher_no", "h.name as hotel_name", "h.address as hotel_address", "h.email as hotel_email", "h.phone as hotel_phone", "h.website as hotel_website", "h.logo as hotel_logo", "ev.name as expense_name", "a.name as account_name", "a.account_number", "a.ac_type", "ev.expense_date", "a.bank as bank_name", "a.branch", "ev.total as total_cost", "ev.remarks as expense_details", "ev.created_at as expense_created_at", "ev.expense_items")
                .leftJoin("hotel as h", "ev.hotel_id", "h.id")
                .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
                .leftJoin("acc_transaction as at", "ev.ac_tr_ac_id", "at.ac_tr_ac_id")
                .leftJoin("acc_ledger as al", "at.ac_tr_id", "al.ac_tr_id")
                .where("ev.id", id)
                .andWhere("ev.hotel_id", hotel_id);
            return data.length > 0 ? data[0] : [];
        });
    }
}
exports.default = ExpenseModel;
//# sourceMappingURL=expenseModel.js.map