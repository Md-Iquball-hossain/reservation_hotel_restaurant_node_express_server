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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
    // create room aminities
    createRoomAminities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_room_aminities")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // create room image
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
            const { key, availability, refundable, hotel_id, occupancy, rooms } = payload;
            const data = yield this.db("room_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("room_id as id", "room_number", "room_type", "bed_type", "refundable", "rate_per_night", "child", "adult", "occupancy", "availability", "room_created_at")
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("room_number", "like", `%${key}%`)
                        .orWhere("room_type", "like", `%${key}%`)
                        .orWhere("bed_type", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (availability) {
                    this.andWhere({ availability });
                }
                if (refundable) {
                    this.andWhere({ refundable });
                }
                if (occupancy) {
                    this.andWhere({ occupancy });
                }
                if (rooms) {
                    this.whereIn("room_id", rooms);
                }
            })
                .orderBy("room_id", "desc");
            const total = yield this.db("room_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("room_id as total")
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("room_number", "like", `%${key}%`)
                        .orWhere("room_type", "like", `%${key}%`)
                        .orWhere("bed_type", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (availability) {
                    this.andWhere({ availability });
                }
                if (refundable) {
                    this.andWhere({ refundable });
                }
                if (occupancy) {
                    this.andWhere({ occupancy });
                }
                if (rooms) {
                    this.whereIn("room_id", rooms);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Get single room
    getSingleRoom(hotel_id, room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
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
    // update room aminities
    updateRoomAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { room_id } = payload, rest = __rest(payload, ["room_id"]);
            return yield this.db("hotel_room_aminities")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(rest)
                .where("room_id", room_id);
        });
    }
}
exports.default = RoomModel;
//# sourceMappingURL=Room.Model.js.map