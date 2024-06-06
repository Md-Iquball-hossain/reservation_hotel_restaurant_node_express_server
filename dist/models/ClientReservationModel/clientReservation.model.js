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
    //=============== client model Room ================ //
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
                .select("rv.room_id as id", "rv.room_type", "rv.bed_type", "rv.refundable", "rv.rate_per_night", "rv.discount", "rv.discount_percent", "rv.child", "rv.adult", "rv.availability", "rv.room_created_at", "rv.room_amenities", "rv.room_images")
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
    // Get single room
    getSingleRoom(hotel_id, room_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("room_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ room_id })
                .andWhere({ hotel_id });
        });
    }
}
exports.default = ClientModel;
//# sourceMappingURL=clientReservation.model.js.map