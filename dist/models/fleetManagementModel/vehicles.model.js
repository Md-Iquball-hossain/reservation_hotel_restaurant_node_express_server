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
class VehiclesModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=================== vehicle ======================//
    // Create vehicle
    createVehicle(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("vehicles")
                .withSchema(this.FLEET_SCHEMA)
                .insert(payload);
        });
    }
    // Get all vehicle
    getAllVehicles(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, status, limit, skip } = payload;
            const dtbs = this.db("vehicles as v");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.FLEET_SCHEMA)
                .select("v.id", "v.reg_number", "v.vehicle_type", "v.manufacturer", "v.model", "v.mileage", "v.license_plate", "v.fuel_type", "v.fuel_quantity", "v.vehicle_photo", "o.name as owner_name", "v.status")
                .where("v.hotel_id", hotel_id)
                .leftJoin("owners as o", "v.owner_id", "o.id")
                .andWhere(function () {
                if (key) {
                    this.andWhere("v.reg_number", "like", `%${key}%`)
                        .orWhere("v.model", "like", `%${key}%`)
                        .orWhere("v.vehicle_type", "like", `%${key}%`)
                        .orWhere("v.license_plate", "like", `%${key}%`);
                }
                if (status) {
                    this.andWhere("v.status", "like", `%${status}%`);
                }
            })
                .orderBy("v.id", "desc");
            const total = yield this.db("vehicles as v")
                .withSchema(this.FLEET_SCHEMA)
                .count("v.id as total")
                .where("v.hotel_id", hotel_id)
                .leftJoin("owners as o", "v.owner_id", "o.id")
                .andWhere(function () {
                if (key) {
                    this.andWhere("v.reg_number", "like", `%${key}%`)
                        .orWhere("v.model", "like", `%${key}%`)
                        .orWhere("v.vehicle_type", "like", `%${key}%`)
                        .orWhere("v.license_plate", "like", `%${key}%`);
                }
                if (status) {
                    this.andWhere("v.status", "like", `%${status}%`);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // check unique vehicles
    checkVehicles(reg_number, license_plate, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db("vehicles")
                .withSchema(this.FLEET_SCHEMA)
                .where({
                reg_number: reg_number,
                license_plate: license_plate,
                hotel_id: hotel_id,
            })
                .first();
        });
    }
    // get single vehicle
    getSingleVehicle(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("vehicle_view as vv")
                .withSchema(this.FLEET_SCHEMA)
                .select("*")
                .where("vv.id", id)
                .andWhere("vv.hotel_id", hotel_id);
        });
    }
    // Update vehicle
    updateVehicle(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("vehicles")
                .withSchema(this.FLEET_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    //=================== Fuel ======================//
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
    //=================== Maintenance ======================//
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
    //=================== Trip ======================//
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
exports.default = VehiclesModel;
//# sourceMappingURL=vehicles.model.js.map