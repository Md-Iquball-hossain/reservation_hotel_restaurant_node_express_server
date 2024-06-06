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
class DriverModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create Driver
    createDriver(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("drivers")
                .withSchema(this.FLEET_SCHEMA)
                .insert(payload);
        });
    }
    // Get all Driver
    getAllDriver(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, id, hotel_id, limit, skip, status } = payload;
            const dtbs = this.db("drivers as d");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.FLEET_SCHEMA)
                .select("d.id", "d.name", "d.phone", "d.photo", "d.license_class", "d.licence_number", "d.year_of_experience", "d.expiry_date", "d.status")
                .where("d.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("d.name", "like", `%${key}%`).orWhere("d.phone", "like", `%${key}%`);
                }
                if (status) {
                    this.andWhere("d.status", "like", `%${status}%`);
                }
                if (id) {
                    this.andWhere("d.id", "like", `%${id}%`);
                }
            })
                .orderBy("d.id", "desc");
            const total = yield this.db("drivers as d")
                .withSchema(this.FLEET_SCHEMA)
                .count("d.id as total")
                .where("d.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("d.name", "like", `%${key}%`).orWhere("d.phone", "like", `%${key}%`);
                }
                if (status) {
                    this.andWhere("d.status", "like", `%${status}%`);
                }
                if (id) {
                    this.andWhere("d.id", "like", `%${id}%`);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // get single Driver
    getSingleDriver(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("driver_view as d")
                .withSchema(this.FLEET_SCHEMA)
                .select("*")
                .where("d.id", id)
                .andWhere("d.hotel_id", hotel_id);
        });
    }
    // Update Driver
    updateDriver(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("drivers")
                .withSchema(this.FLEET_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
}
exports.default = DriverModel;
//# sourceMappingURL=drivers.model.js.map