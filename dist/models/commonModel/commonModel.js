"use strict";
/*
DB Query for common OTP
@Author Shidul Islam <shidul.m360ict@gmail.com>
*/
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
class CommonModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert OTP
    insertOTP(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("email_otp")
                .withSchema(this.M_RESERVATION_SCHEMA)
                .insert(payload);
        });
    }
    // get otp
    getOTP(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield this.db("email_otp")
                .withSchema(this.M_RESERVATION_SCHEMA)
                .select("id", "hashed_otp", "tried")
                .andWhere("email", payload.email)
                .andWhere("type", payload.type)
                .andWhere("matched", 0)
                .andWhere("tried", "<", 3)
                .andWhereRaw("ADDTIME(created_at, '0:3:0') > NOW()");
            return check;
        });
    }
    // update otp
    updateOTP(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("email_otp")
                .withSchema(this.M_RESERVATION_SCHEMA)
                .update(payload)
                .where(where);
        });
    }
    // user password verify
    getUserPassword({ table, schema, passField, userIdField, userId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(table)
                .withSchema(schema)
                .select(passField)
                .where(userIdField, userId);
        });
    }
    // update password
    updatePassword({ table, userIdField, userId, passField, schema, hashedPass, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(table)
                .update(passField, hashedPass)
                .withSchema(schema)
                .where(userIdField, userId);
        });
    }
}
exports.default = CommonModel;
/*
DB Query for common OTP Last update
@Author Mahmudul islam Moon <moon.m360ict@gmail.com>
*/
//# sourceMappingURL=commonModel.js.map