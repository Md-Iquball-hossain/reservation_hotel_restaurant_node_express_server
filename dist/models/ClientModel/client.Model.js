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
class ClientModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=============== Guest ================ //
    // Create user
    createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get Guest email
    getAllGuestEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, hotel_id } = payload;
            const dtbs = this.db("user");
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ "user.hotel_id": hotel_id })
                .andWhere({ "user.email": email })
                .orderBy("id", "desc");
            return { data };
        });
    }
    // Get User single profile
    getSingleUser(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id, hotel_id } = where;
            return yield this.db("user")
                .select("*")
                .withSchema(this.RESERVATION_SCHEMA)
                .where(function () {
                if (id) {
                    this.where("id", id);
                }
                if (email) {
                    this.where("email", email);
                }
                if (hotel_id) {
                    this.andWhere("hotel_id", hotel_id);
                }
            });
        });
    }
    //   update single guest
    updateSingleUser(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, id } = where;
            return yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .where({ hotel_id })
                .andWhere({ id });
        });
    }
    updateUser(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .where({ email: where.email });
        });
    }
    //=============== Room ================ //
    // Get All room
    getAllRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, availability, refundable, limit, skip, hotel_id, adult, child, rooms } = payload;
            const dtbs = this.db("room_view as rv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("rv.room_id as id", "rv.room_type", "rv.bed_type", "rv.refundable", "rv.rate_per_night", "rv.discount", "rv.discount_percent", "rv.child", "rv.adult", "rv.availability", "rv.room_description", "rv.room_amenities", "rv.room_images")
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
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("room_booking_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            return yield dtbs
                .select("id", "hotel_id", "check_in_time", "check_out_time", "booking_rooms")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ hotel_id })
                .andWhere({ reserved_room: 1 })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("check_in_time", [from_date, endDate]);
                }
            })
                .andWhereNot({ status: "left" });
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
    // Get all room images
    getHotelRoomImages(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id } = payload;
            const dtbs = this.db("hotel_room as hr");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("hri.id", "hri.room_id", "hr.room_number", "hri.photo")
                .rightJoin("hotel_room_images as hri", "hr.id", "hri.room_id")
                .where({ hotel_id });
            const total = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ hotel_id });
            return { data };
        });
    }
    //=============== Room Booking ================ //
    // insert room booking
    insertRoomBooking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // insert booking rooms
    insertBookingRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("booking_rooms")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get all room booking
    getAllRoomBooking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, name, status, user_id } = payload;
            const dtbs = this.db("room_booking_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("id", "booking_no", "user_id", "name", "photo", "email", "check_in_time", "check_out_time", "number_of_nights", "total_occupancy", "extra_charge", "grand_total", "status", "check_in_out_status", "booking_rooms")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("name", "like", `%${name}%`)
                        .orWhere("email", "like", `%${name}%`)
                        .orWhereRaw("JSON_EXTRACT(booking_rooms, '$[*].room_number') LIKE ?", [`%${name}%`]);
                }
                if (user_id) {
                    this.andWhere({ user_id });
                }
                if (status) {
                    this.andWhere({ status });
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("room_booking_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("id as total")
                .where("hotel_id", hotel_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("name", "like", `%${name}%`)
                        .orWhere("email", "like", `%${name}%`)
                        .orWhereRaw("JSON_EXTRACT(booking_rooms, '$[*].room_number') LIKE ?", [`%${name}%`]);
                }
                if (status) {
                    this.andWhere({ status });
                }
            });
            return { data, total: total[0].total };
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
    // get last room booking id
    getLastRoomBookingId(hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("id")
                .where({ hotel_id })
                .orderBy("id", "desc")
                .limit(1);
        });
    }
    // get single room booking
    getSingleRoomBooking(id, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_booking_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where({ id })
                .andWhere({ hotel_id });
        });
    }
}
exports.default = ClientModel;
//# sourceMappingURL=client.Model.js.map