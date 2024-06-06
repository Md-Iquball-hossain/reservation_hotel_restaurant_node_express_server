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
class RoomModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create room
    createRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // room number fetch
    getRoomByNumber(room_number, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db("hotel_room")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({
                room_number: room_number,
                hotel_id: hotel_id,
            })
                .first();
        });
    }
    // insert hotel room amenities
    insertHotelRoomAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Create room image
    createRoomImage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All room
    getAllRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, refundable, limit, skip, hotel_id, adult, child, rooms, } = payload;
            console.log({ hotel_id });
            const dtbs = this.db("room_view as rv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("rv.room_id as id", "rv.room_number", "rv.room_type", "rv.bed_type", "rv.refundable", "rv.rate_per_night", "rv.discount", "rv.discount_percent", "rv.child", "rv.adult", "rv.occupancy", "rv.tax_percent", "rv.availability", "rv.room_description", "rv.room_amenities", "rv.room_images")
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("rv.room_number", "like", `%${key}%`)
                        .orWhere("rv.room_type", "like", `%${key}%`)
                        .orWhere("rv.bed_type", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (availability) {
                    this.andWhere({ availability });
                }
                if (refundable) {
                    this.andWhere({ refundable });
                }
                if (child) {
                    this.andWhere({ child });
                }
                if (adult) {
                    this.andWhere({ adult });
                }
                if (rooms) {
                    this.whereIn("rv.room_id", rooms);
                }
            })
                .orderBy("rv.room_id", "desc");
            const total = yield this.db("room_view as rv")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("rv.room_id as total")
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("rv.room_number", "like", `%${key}%`)
                        .orWhere("rv.room_type", "like", `%${key}%`)
                        .orWhere("rv.bed_type", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (availability) {
                    this.andWhere({ availability });
                }
                if (refundable) {
                    this.andWhere({ refundable });
                }
                if (child) {
                    this.andWhere({ child });
                }
                if (adult) {
                    this.andWhere({ adult });
                }
                if (rooms) {
                    this.whereIn("rv.room_id", rooms);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Get all booking room
    getAllBookingRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, to_date, from_date } = payload;
            const dtbs = this.db("room_booking_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            return yield dtbs
                .select("id", "hotel_id", "check_in_time", "check_out_time", "name", "email", "grand_total", "due", "user_last_balance", "booking_rooms")
                .withSchema(this.RESERVATION_SCHEMA)
                .where((qb) => {
                qb.andWhere({ hotel_id });
                qb.andWhere({ reserved_room: 1 });
                qb.andWhereNot({ status: "left" });
                if (from_date && to_date) {
                    qb.andWhereBetween("check_in_time", [from_date, to_date]);
                }
            });
        });
    }
    // get all booking room second query avaibility with checkout
    getAllBookingRoomForSdQueryAvailblityWithCheckout(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, to_date, from_date } = payload;
            const dtbs = this.db("room_booking_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            return yield dtbs
                .select("id", "hotel_id", "check_in_time", "check_out_time", "name", "email", "grand_total", "due", "user_last_balance", "booking_rooms")
                .withSchema(this.RESERVATION_SCHEMA)
                .where((qb) => {
                qb.andWhere({ hotel_id });
                qb.andWhere({ reserved_room: 1 });
                qb.andWhereNot({ status: "left" });
                if (from_date && to_date) {
                    qb.andWhere("check_out_time", ">=", to_date).andWhere("check_in_time", "<=", from_date);
                }
            });
        });
    }
    // Get single room
    getSingleRoom(hotel_id, room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ room_id })
                .andWhere({ hotel_id });
        });
    }
    // update hotel room
    updateRoom(roomId, hotel_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .where({ id: roomId })
                .andWhere({ hotel_id });
        });
    }
    // update many room
    updateManyRoom(roomIds, hotel_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .whereIn("id", roomIds)
                .andWhere({ hotel_id });
        });
    }
    // insert room new photo
    insertRoomImage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // remove room photo
    deleteRoomImage(payload, room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .delete()
                .whereIn("id", payload)
                .andWhere("room_id", room_id);
        });
    }
    // get all Room Amenities
    getAllAmenities(room_id, rah_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ room_id })
                .whereIn("rah_id", rah_id);
        });
    }
    // delete hotel room amnities
    deleteHotelRoomAmenities(payload, room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_amenities")
                .withSchema(this.RESERVATION_SCHEMA)
                .delete()
                .whereIn("id", payload)
                .andWhere("room_id", room_id);
        });
    }
}
exports.default = RoomModel;
//# sourceMappingURL=Room.Model.js.map