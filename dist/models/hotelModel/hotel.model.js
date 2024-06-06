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
class HotelModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create hotel
    createHotel(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get all hotel
    getAllHotel(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, name, status, limit, skip } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("hotel");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESERVATION_SCHEMA)
                .select("id", "name", "city", "email", "status", "group", "logo", "expiry_date", "created_at")
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("created_at", [from_date, endDate]);
                }
                if (name) {
                    this.andWhere("name", "like", `%${name}%`)
                        .orWhere("group", "like", `%${name}%`)
                        .orWhere("city", "like", `%${name}%`);
                }
                if (status) {
                    this.andWhere({ status });
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("hotel")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("id AS total")
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("created_at", [from_date, to_date]);
                }
                if (name) {
                    this.andWhere("name", "like", `%${name}%`)
                        .orWhere("group", "like", `%${name}%`)
                        .orWhere("city", "like", `%${name}%`);
                }
                if (status) {
                    this.andWhere({ status });
                }
            });
            return {
                data,
                total: total[0].total,
            };
        });
    }
    // get single hotel
    getSingleHotel(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db("hotel_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .select("*")
                .where(function () {
                if (id) {
                    this.andWhere({ id });
                }
                if (email) {
                    this.andWhere({ email });
                }
            });
        });
    }
    // update hotel
    updateHotel(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id } = where;
            return yield this.db("hotel")
                .withSchema(this.RESERVATION_SCHEMA)
                .update(payload)
                .where(function () {
                if (id) {
                    this.where({ id });
                }
                else if (email) {
                    this.where({ email });
                }
            });
        });
    }
    // insert hotel images
    insertHotelImage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // delete hotel images
    deleteHotelImage(payload, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_images")
                .withSchema(this.RESERVATION_SCHEMA)
                .delete()
                .whereIn("id", payload)
                .andWhere("hotel_id", hotel_id);
        });
    }
    // insert hotel amnities
    insertHotelAmnities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_aminities")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // delete hotel amnities
    deleteHotelAmnities(payload, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("hotel_aminities")
                .withSchema(this.RESERVATION_SCHEMA)
                .delete()
                .whereIn("id", payload)
                .andWhere("hotel_id", hotel_id);
        });
    }
}
exports.default = HotelModel;
//# sourceMappingURL=hotel.model.js.map