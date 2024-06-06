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
class RUserAdminModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    insertUserAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_admin")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get admin by email
    getAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_admin AS ua")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("ua.id", "ua.email", "ua.password", "ua.name", "ua.avatar", "ua.phone", "ua.status", "r.id As roleId", "r.name As roleName", "ua.created_at")
                .leftJoin("role AS r", "ua.role", "r.id")
                .where({ email });
        });
    }
    // get admin by id
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_admin AS ua")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("ua.id", "ua.email", "ua.password", "ua.name", "ua.avatar", "ua.phone", "ua.status", "r.id As roleId", "r.name As roleName", "ua.created_at")
                .leftJoin("role AS r", "ua.role", "r.id")
                .where("ua.id", id);
        });
    }
    // get all admin
    getAllAdmin(limit, skip, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("user_admin AS ua");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("ua.id", "ua.email", "ua.name", "ua.avatar", "ua.phone", "ua.status", "r.id As roleId", "r.name As roleName", "ua.created_at")
                .leftJoin("role AS r", "ua.role", "r.id")
                .where(function () {
                if (status) {
                    this.where({ status });
                }
            });
            const total = yield this.db("user_admin AS ua")
                .count("ua.id As total")
                .withSchema(this.RESERVATION_SCHEMA)
                .leftJoin("role AS r", "ua.role", "r.id")
                .where(function () {
                if (status) {
                    this.where({ status });
                }
            });
            return { data, total: total[0].total };
        });
    }
    // update admin model
    updateAdmin(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_admin")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .where({ email: where.email });
        });
    }
}
exports.default = RUserAdminModel;
//# sourceMappingURL=rUserAdmin.model.js.map