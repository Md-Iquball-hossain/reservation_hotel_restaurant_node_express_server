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
    // Create Guest
    createGuest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // Create user_type
    createUserType(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get Guest user_type
    getGuest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("user_view")
                .select("*")
                .withSchema(this.RESERVATION_SCHEMA)
                .orderBy("id", "desc");
            const total = yield this.db("user_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("id as total");
            return { data, total: total[0].total };
        });
    }
    // Get User Type
    getAllUserType() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_type")
                .select("*")
                .withSchema(this.RESERVATION_SCHEMA);
        });
    }
    // get exists user_type
    getExistsUserType(user_id, user_type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({
                user_id: user_id,
                user_type: user_type,
            })
                .first();
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
    // insert into guest ledger
    insertGuestLedger(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_ledger")
                .withSchema(this.RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get ledeger last balance by user
    getLedgerLastBalanceByUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id, user_id } = payload;
            const result = yield this.db.raw(`SELECT ${this.RESERVATION_SCHEMA}.get_user_ledger_balance(?, ?) AS remaining_balance`, [user_id, hotel_id]);
            const remainingBalance = result[0][0].remaining_balance;
            return remainingBalance;
        });
    }
    // Get All Guest Model
    getAllGuest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, hotel_id, limit, skip, user_type } = payload;
            const dtbs = this.db("user_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("id", "name", "email", "country", "city", "status", "last_balance", "created_at", "user_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("name", "like", `%${key}%`)
                        .orWhere("email", "like", `%${key}%`)
                        .orWhere("country", "like", `%${key}%`)
                        .orWhere("city", "like", `%${key}%`);
                }
                if (user_type) {
                    this.andWhereRaw(`JSON_CONTAINS(user_type, '[{"user_type": "${user_type}"}]')`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("user_view")
                .withSchema(this.RESERVATION_SCHEMA)
                .count("id as total")
                .where({ hotel_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere("name", "like", `%${key}%`)
                        .orWhere("email", "like", `%${key}%`)
                        .orWhere("country", "like", `%${key}%`)
                        .orWhere("city", "like", `%${key}%`);
                }
                if (user_type) {
                    this.andWhereRaw(`JSON_CONTAINS(user_type, '[{"user_type": "${user_type}"}]')`);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // Get Guest single profile
    getSingleGuest(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id, hotel_id } = where;
            return yield this.db("user_view as uv")
                .select("uv.id", "uv.name", "uv.email", "uv.country", "uv.city", "uv.status", "uv.last_balance", "uv.created_at", "uv.user_type")
                .withSchema(this.RESERVATION_SCHEMA)
                .where(function () {
                if (id) {
                    this.where("uv.id", id);
                }
                if (email) {
                    this.where("uv.email", email);
                }
                if (hotel_id) {
                    this.andWhere("uv.hotel_id", hotel_id);
                }
            });
        });
    }
    //   update single guest
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
    //  update guest
    updateGuest(id, hotel_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db("user")
                .withSchema(this.RESERVATION_SCHEMA)
                .where({ id, hotel_id })
                .update(payload);
        });
    }
    // Get Hall Guest
    getHallGuest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = payload;
            const dtbs = this.db("user as u");
            const data = yield dtbs
                .select("u.id", "u.name", "u.email", "u.last_balance")
                .withSchema(this.RESERVATION_SCHEMA)
                .distinct("u.id", "u.name", "u.email")
                .rightJoin("hall_booking as hb", "u.id", "hb.user_id")
                .where("u.hotel_id", hotel_id)
                .orderBy("u.id", "desc");
            const total = yield this.db("user as u")
                .withSchema(this.RESERVATION_SCHEMA)
                .rightJoin("hall_booking as hb", "u.id", "hb.user_id")
                .countDistinct("u.id as total")
                .where("u.hotel_id", hotel_id);
            return { data, total: total[0].total };
        });
    }
    // Get Room Guest
    getRoomGuest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = payload;
            const data = yield this.db("user as u")
                .distinct("u.id", "u.name", "u.email", "u.last_balance")
                .withSchema(this.RESERVATION_SCHEMA)
                .rightJoin("room_booking as rb", "u.id", "rb.user_id")
                .where("u.hotel_id", hotel_id)
                .orderBy("u.id", "desc");
            const total = yield this.db("user as u")
                .withSchema(this.RESERVATION_SCHEMA)
                .countDistinct("u.id as total")
                .rightJoin("room_booking as rb", "u.id", "rb.user_id")
                .where("u.hotel_id", hotel_id);
            return { data, total: total[0].total };
        });
    }
}
exports.default = GuestModel;
//# sourceMappingURL=guestModel.js.map