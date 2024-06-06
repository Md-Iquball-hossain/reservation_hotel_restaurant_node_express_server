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
class EmployeeModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create Employee
    insertEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("employee")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Employee Model
    getAllEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, limit, skip, category } = payload;
            const dtbs = this.db("employee as e");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("e.id", "e.name", "e.email", 'e.mobile_no', "d.name as department", "de.name as designation", "e.category", "e.salary", "e.joining_date", "e.status")
                .withSchema(this.RESERVATION_SCHEMA)
                .leftJoin("department as d", "e.department_id", "d.id")
                .leftJoin("designation as de", "e.designation_id", "de.id")
                .where("e.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("e.name", "like", `%${key}%`)
                        .orWhere("e.email", "like", `%${key}%`)
                        .orWhere("d.name", "like", `%${key}%`);
                }
                if (category) {
                    this.andWhere("e.category", "like", `%${category}%`);
                }
            })
                .orderBy('e.id', 'desc');
            const total = yield this.db("employee as e")
                .count("e.id as total")
                .withSchema(this.RESERVATION_SCHEMA)
                .leftJoin("department as d", "e.department_id", "d.id")
                .leftJoin("designation as de", "e.designation_id", "de.id")
                .where("e.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("e.name", "like", `%${key}%`)
                        .orWhere("e.email", "like", `%${key}%`)
                        .orWhere("d.name", "like", `%${key}%`);
                }
                if (category) {
                    this.andWhere("e.category", "like", `%${category}%`);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Get Single Employee
    getSingleEmployee(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("employee_view as ev")
                .withSchema(this.RESERVATION_SCHEMA)
                .select('ev.id', 'ev.name', 'ev.photo', 'ev.dep_id', 'ev.dep_name as department', 'ev.des_id', "ev.res_id", "ev.admin_id", "ev.res_name", 'ev.des_name as designation', 'ev.email', 'ev.mobile_no', 'ev.address', 'ev.blood_group', 'ev.salary', 'ev.status', 'ev.birth_date', "ev.category", 'ev.appointment_date', 'ev.joining_date', 'ev.created_by', 'ev.created_at', 'ev.updated_at')
                .where('ev.id', id)
                .andWhere('ev.hotel_id', hotel_id);
            return data.length > 0 ? data[0] : [];
        });
    }
    // Update Employee
    updateEmployee(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("employee")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete Employee
    deleteEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("employee")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id })
                .del();
        });
    }
}
exports.default = EmployeeModel;
//# sourceMappingURL=employeeModel.js.map