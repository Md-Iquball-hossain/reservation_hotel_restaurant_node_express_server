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
class ParkingModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // Create Parking
    createParking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("parking")
                .withSchema(this.FLEET_SCHEMA)
                .insert(payload);
        });
    }
    // Get all Parking
    getAllParking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, key, hotel_id, limit, skip, status, parking_size } = payload;
            const dtbs = this.db("parking as p");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.FLEET_SCHEMA)
                .select("p.id", "p.parking_area", "p.parking_size", "p.par_slot_number", "p.status")
                .where("p.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("p.par_slot_number", "like", `%${key}%`)
                        .orWhere("p.parking_area", "like", `%${key}%`);
                }
                if (parking_size) {
                    this.andWhere("p.parking_size", "like", `%${parking_size}%`);
                }
                if (status) {
                    this.andWhere("p.status", "like", `%${status}%`);
                }
                if (id) {
                    this.andWhere("p.id", "like", `%${id}%`);
                }
            })
                .orderBy("p.id", "desc");
            const total = yield this.db("parking as p")
                .withSchema(this.FLEET_SCHEMA)
                .count("p.id as total")
                .where("p.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("p.par_slot_number", "like", `%${key}%`)
                        .orWhere("p.parking_area", "like", `%${key}%`);
                }
                if (status) {
                    this.andWhere("p.status", "like", `%${status}%`);
                }
                if (id) {
                    this.andWhere("p.id", "like", `%${id}%`);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // get single parking
    getSingleParking(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("parking_view")
                .withSchema(this.FLEET_SCHEMA)
                .select("*")
                .where({ id })
                .andWhere({ hotel_id });
        });
    }
    // Update Parking
    updateParking(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("parking")
                .withSchema(this.FLEET_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Get all Vehicle Parking
    getAllVehicleParking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status, vehicle_id, from_date, to_date } = payload;
            const dtbs = this.db("veh_parking as vp");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate());
            const data = yield dtbs
                .withSchema(this.FLEET_SCHEMA)
                .select("vp.id", "v.license_plate as vehicle", "p.par_slot_number as parking_number", "vp.assigned_time as parking_date", "vp.left_time", "vp.status")
                .leftJoin("parking as p", "vp.parking_id", "p.id")
                .leftJoin("vehicles as v", "vp.vehicle_id", "v.id")
                .andWhere(function () {
                if (status) {
                    this.andWhere("vp.status", "like", `%${status}%`);
                }
                if (vehicle_id) {
                    this.andWhere("vp.vehicle_id", "like", `%${vehicle_id}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("vp.created_at", [from_date, endDate]);
                }
            })
                .orderBy("vp.id", "desc");
            const total = yield this.db("veh_parking as vp")
                .withSchema(this.FLEET_SCHEMA)
                .count("vp.id as total")
                .leftJoin("parking as p", "vp.parking_id", "p.id")
                .leftJoin("vehicles as v", "vp.vehicle_id", "v.id")
                .andWhere(function () {
                if (status) {
                    this.andWhere("vp.status", "like", `%${status}%`);
                }
                if (vehicle_id) {
                    this.andWhere("vp.vehicle_id", "like", `%${vehicle_id}%`);
                }
                if (from_date && to_date) {
                    this.andWhereBetween("vp.created_at", [from_date, endDate]);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Assign vehicle in Parking
    createVehicleParking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("veh_parking")
                .withSchema(this.FLEET_SCHEMA)
                .insert(payload);
        });
    }
    // Update vehicle in Parking
    updateVehiceInParking(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("veh_parking")
                .withSchema(this.FLEET_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // get single vehicle from parking
    getSingleVehicleParking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("veh_parking")
                .withSchema(this.FLEET_SCHEMA)
                .select("*")
                .where("id", id);
        });
    }
}
exports.default = ParkingModel;
//# sourceMappingURL=parking.model.js.map