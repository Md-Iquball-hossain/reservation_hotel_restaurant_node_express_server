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
class FuelModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create Fuel Refill
    createFuelRefill(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("fuel_refill")
                .withSchema(this.FLEET_SCHEMA)
                .insert(payload);
        });
    }
    // Get all fuel refill
    getAllFuelRefill(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, limit, from_date, to_date, skip } = payload;
            const dtbs = this.db("fuel_refill as fr");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.FLEET_SCHEMA)
                .select("fr.id", "v.license_plate as vehicle_number", "fr.filling_station_name", "fr.fuel_quantity", "fr.per_quantity_amount as price", "fr.total_amount", "fr.refilled_by", "fr.refilled_date", "fr.documents")
                .where("fr.hotel_id", hotel_id)
                .leftJoin("vehicles as v", "fr.vehicle_id", "v.id")
                .andWhere(function () {
                if (key) {
                    this.andWhere("fr.filling_station_name", "like", `%${key}%`).orWhere("fr.refilled_by", "like", `%${key}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("fr.refilled_date", [from_date, endDate]);
                }
            })
                .orderBy("fr.id", "desc");
            const total = yield this.db("fuel_refill as fr")
                .withSchema(this.FLEET_SCHEMA)
                .count("fr.id as total")
                .where("fr.hotel_id", hotel_id)
                .leftJoin("vehicles as v", "fr.vehicle_id", "v.id")
                .andWhere(function () {
                if (key) {
                    this.andWhere("fr.filling_station_name", "like", `%${key}%`).orWhere("fr.refilled_by", "like", `%${key}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("fr.refilled_date", [from_date, endDate]);
                }
            });
            return { data, total: total[0].total };
        });
    }
}
exports.default = FuelModel;
//# sourceMappingURL=fuel.model.js.map