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
class PayRollModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create PayRoll
    CreatePayRoll(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("payroll")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Create pay roll deductions
    createPayRoll_deductions(insertObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("payroll_deductions")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(insertObj);
            return res;
        });
    }
    // Create pay roll additions
    createPayRoll_additions(insertObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.db("payroll_additions")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(insertObj);
            return res;
        });
    }
    // Get All Pay Roll
    getAllPayRoll(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, limit, skip, from_date, to_date } = payload;
            const dtbs = this.db("payroll as p");
            const endDatePlusOneDay = new Date(to_date);
            endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("p.id", "p.voucher_no", "e.name as employee_name", "de.name as designation", "a.ac_type as pay_method", "a.name as account_name", "e.salary as base_salary", "p.attendance_days", "p.working_hours", "p.gross_salary", "p.total_salary", "p.salary_date")
                .withSchema(this.RESERVATION_SCHEMA)
                .leftJoin("employee as e", "e.id", "p.employee_id")
                .leftJoin("designation as de", "de.id", "e.designation_id")
                .leftJoin("account as a", "a.id", "p.ac_tr_ac_id")
                .where("p.hotel_id", hotel_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("p.salary_date", [from_date, to_date]);
                }
                if (key) {
                    this.andWhere("e.name", "like", `%${key}%`)
                        .orWhere("de.name", "like", `%${key}%`)
                        .orWhere("p.voucher_no", "like", `%${key}%`)
                        .orWhere("a.name", "like", `%${key}%`);
                }
            })
                .orderBy('p.id', 'desc');
            const total = yield this.db("payroll as p")
                .count("p.id as total")
                .withSchema(this.RESERVATION_SCHEMA)
                .leftJoin("employee as e", "e.id", "p.employee_id")
                .leftJoin("designation as de", "de.id", "e.designation_id")
                .leftJoin("account as a", "a.id", "p.ac_tr_ac_id")
                .where("p.hotel_id", hotel_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("p.salary_date", [from_date, to_date]);
                }
                if (key) {
                    this.andWhere("e.name", "like", `%${key}%`)
                        .orWhere("de.name", "like", `%${key}%`)
                        .orWhere("p.voucher_no", "like", `%${key}%`)
                        .orWhere("a.name", "like", `%${key}%`);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // get all voucher last id
    getAllIVoucherForLastId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("payroll")
                .select("id")
                .withSchema(this.RESERVATION_SCHEMA)
                .orderBy("id", "desc")
                .limit(1);
        });
    }
    // get single pay Roll 
    getSinglePayRoll(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("payroll_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where({ id })
                .andWhere({ hotel_id });
        });
    }
}
exports.default = PayRollModel;
//# sourceMappingURL=payRollModel.js.map