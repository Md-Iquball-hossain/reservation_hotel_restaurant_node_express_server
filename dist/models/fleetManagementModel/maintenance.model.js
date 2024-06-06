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
class MaintenanceModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create Maintenance
    createMaintenance(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("maintenance")
                .withSchema(this.FLEET_SCHEMA)
                .insert(payload);
        });
    }
    // Get all Maintenance
    getAllMaintenance(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, limit, from_date, to_date, skip } = payload;
            const dtbs = this.db("maintenance as m");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.FLEET_SCHEMA)
                .select("m.id", "m.maintenance_date", "m.maintenance_type", "m.maintenance_cost", "m.documents")
                .where("m.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("m.maintenance_type", "like", `%${key}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("m.created_at", [from_date, endDate]);
                }
            })
                .orderBy("m.id", "desc");
            const total = yield this.db("maintenance as m")
                .withSchema(this.FLEET_SCHEMA)
                .count("m.id as total")
                .where("m.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("m.maintenance_type", "like", `%${key}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("m.created_at", [from_date, endDate]);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Update Maintenance
    updateMaintenance(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("maintenance")
                .withSchema(this.FLEET_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
}
exports.default = MaintenanceModel;
//# sourceMappingURL=maintenance.model.js.map