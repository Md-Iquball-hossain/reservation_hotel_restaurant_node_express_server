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
class HallModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create Hall
    createHall(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Hall Name fetch
    getAllHallName(name, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db("hall")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({
                name: name,
                hotel_id: hotel_id,
            })
                .first();
        });
    }
    // insert Hall room amenities
    insertHallRoomAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_room_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Create Hall image
    createHallImage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All hall
    getAllHall(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hall_status, limit, skip, halls, hotel_id } = payload;
            const dtbs = this.db("hall_view as hv");
            if (limit) {
                dtbs.limit(parseInt(limit));
            }
            if (skip) {
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("hv.hall_id as id", "hv.name", "hv.hall_size", "hv.rate_per_hour", "hv.capacity", "hv.location", "hv.hall_amenities", "hv.hall_images", "hv.hall_status", "hv.created_at")
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("hv.name", "like", `%${key}%`);
                }
                if (hall_status) {
                    this.andWhere("hv.hall_status", "like", `%${hall_status}%`);
                }
                if (halls) {
                    this.whereIn("hv.hall_id", halls);
                }
            })
                .orderBy("hv.hall_id", "desc");
            const total = yield this.db("hall_view as hv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("hv.hall_id as total")
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("hv.name", "like", `%${key}%`);
                }
                if (hall_status) {
                    this.andWhere("hv.hall_status", "like", `%${hall_status}%`);
                }
                if (halls) {
                    this.whereIn("hv.hall_id", halls);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Get all booking hall
    getAllBookingHall(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, end_time, event_date, start_time } = payload;
            const dtbs = this.db("hall_booking_view");
            if (limit) {
                dtbs.limit(parseInt(limit));
            }
            if (skip) {
                dtbs.offset(parseInt(skip));
            }
            return yield dtbs
                .select("id", "hotel_id", "start_time", "end_time", "event_date", "name", "email", "grand_total", "due", "user_last_balance", "booking_halls")
                .withSchema(this.RESERVATION_SCHEMA)
                .where((qb) => {
                qb.andWhere({ hotel_id });
                qb.andWhere({ reserved_hall: 1 });
                qb.andWhere({ event_date });
                qb.andWhereNot({ booking_status: "left" });
                if (start_time && end_time) {
                    qb.andWhereBetween("start_time", [start_time, end_time]);
                }
            });
        });
    }
    // get all booking hall second query avaibility with checkout
    getAllBookingHallForSdQueryAvailblityWithCheckout(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, start_time, end_time, event_date } = payload;
            const dtbs = this.db("hall_booking_view");
            if (limit) {
                dtbs.limit(parseInt(limit));
            }
            if (skip) {
                dtbs.offset(parseInt(skip));
            }
            return yield dtbs
                .select("id", "hotel_id", "start_time", "end_time", "event_date", "name", "email", "grand_total", "due", "user_last_balance", "booking_halls")
                .withSchema(this.RESERVATION_SCHEMA)
                .where((qb) => {
                qb.andWhere({ hotel_id });
                qb.andWhere({ reserved_hall: 1 });
                qb.andWhere({ event_date });
                qb.andWhereNot({ booking_status: "left" });
                if (start_time && end_time) {
                    qb.andWhereNotBetween("start_time", [start_time, end_time]);
                    qb.andWhere("end_time", ">", start_time)
                        .andWhere("start_time", "<", end_time);
                }
            });
        });
    }
    // Get single hall
    getSingleHall(hotel_id, hall_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ hall_id })
                .andWhere({ hotel_id });
        });
    }
    // update hotel Hall
    updateHall(hall_id, hotel_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .where({ id: hall_id })
                .andWhere({ hotel_id });
        });
    }
    // insert hall's new photo
    insertHallImage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // remove room photo
    deleteHallImage(payload, hall_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .delete()
                .whereIn("id", payload)
                .andWhere("hall_id", hall_id);
        });
    }
    // update many hall
    updateManyHall(hall_id, hotel_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .whereIn("id", hall_id)
                .andWhere({ hotel_id });
        });
    }
    // get all Hall Amenities
    getAllHallAmenities(hall_id, hotel_id, amenity_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_room_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ hall_id, hotel_id })
                .whereIn("amenity_id", amenity_id)
                .select('hall_id', 'amenity_id');
        });
    }
    // delete hall amnities
    deleteHallAmenities(payload, hall_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hall_room_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .delete()
                .whereIn("id", payload)
                .andWhere("hall_id", hall_id);
        });
    }
}
exports.default = HallModel;
//# sourceMappingURL=hallModel.js.map