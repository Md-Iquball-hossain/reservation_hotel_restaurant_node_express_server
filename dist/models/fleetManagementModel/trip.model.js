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
class TripModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create Trip
    createTrip(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("trips")
                .withSchema(this.FLEET_SCHEMA)
                .insert(payload);
        });
    }
    // Get Trip
    getAllTrip(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, limit, from_date, to_date, skip } = payload;
            const dtbs = this.db("trips as t");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.FLEET_SCHEMA)
                .select("t.id", "v.license_plate as vehicle_number", "d.name as driver_name", "t.trip_start", "t.trip_end", "t.start_location", "t.end_location", "t.fuel_usage", "t.trip_cost", "t.distance")
                .where("t.hotel_id", hotel_id)
                .leftJoin("vehicles as v", "t.vehicle_id", "v.id")
                .leftJoin("drivers as d", "t.driver_id", "d.id")
                .andWhere(function () {
                if (key) {
                    this.andWhere("v.license_plate", "like", `%${key}%`).orWhere("d.name", "like", `%${key}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("t.trip_start", [from_date, endDate]);
                }
            })
                .orderBy("t.id", "desc");
            const total = yield this.db("trips as t")
                .withSchema(this.FLEET_SCHEMA)
                .count("t.id as total")
                .where("t.hotel_id", hotel_id)
                .leftJoin("vehicles as v", "t.vehicle_id", "v.id")
                .leftJoin("drivers as d", "t.driver_id", "d.id")
                .andWhere(function () {
                if (key) {
                    this.andWhere("v.license_plate", "like", `%${key}%`).orWhere("d.name", "like", `%${key}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("t.trip_start", [from_date, endDate]);
                }
            });
            return { data, total: total[0].total };
        });
    }
}
exports.default = TripModel;
//# sourceMappingURL=trip.model.js.map