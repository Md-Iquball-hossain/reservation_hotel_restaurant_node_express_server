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
class GuestModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert Guest
    insertGuest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Guest Model
    getAllGuest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, limit, skip } = payload;
            const dtbs = this.db("user");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("id", "name", "email", "country", "city", "status", "last_balance", "created_at")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ "user.hotel_id": hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("name", "like", `%${key}%`)
                        .orWhere("email", "like", `%${key}%`)
                        .orWhere("country", "like", `%${key}%`)
                        .orWhere("city", "like", `%${key}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("id as total")
                .where({ "user.hotel_id": hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("name", "like", `%${key}%`)
                        .orWhere("email", "like", `%${key}%`)
                        .orWhere("country", "like", `%${key}%`)
                        .orWhere("city", "like", `%${key}%`);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Get Guest single profile
    getSingleGuest(where) {
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
                    this.where("hotel_id", hotel_id);
                }
            });
        });
    }
    //   update guest
    updateSingleGuest(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, id } = where;
            return yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .where({ hotel_id })
                .andWhere({ id });
        });
    }
}
exports.default = GuestModel;
``;
//# sourceMappingURL=guestModel.js.map