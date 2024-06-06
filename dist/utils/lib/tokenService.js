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
const database_1 = require("../../app/database");
const uuid_1 = require("uuid");
const lib_1 = __importDefault(require("./lib"));
class TokenService {
    constructor(table) {
        this.db = database_1.db;
        this.table = table;
    }
    // get secret by id
    getTokenSecretById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield this.db(this.table)
                .select('access_token_secret', 'refresh_token_secret')
                .where('id', id);
            if (secret.length) {
                return secret[0];
            }
            else {
                return false;
            }
        });
    }
    // create access token and refresh token
    createRefreshAccessToken(data, type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const access_token_secret = (0, uuid_1.v4)();
            const refresh_token_secret = (0, uuid_1.v4)();
            const accessToken = lib_1.default.createToken(Object.assign(Object.assign({}, data), { type: 'access_token', userType: type }), access_token_secret, '1h');
            const refreshToken = lib_1.default.createToken(Object.assign(Object.assign({}, data), { type: 'refresh_token', userType: type }), refresh_token_secret, '1d');
            const insertSecret = yield this.db(this.table).insert({
                access_token_secret,
                refresh_token_secret,
                user_id: id,
            });
            if (insertSecret.length) {
                return {
                    success: true,
                    data: { accessToken, refreshToken, uuid: insertSecret[0] },
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot create token!',
                };
            }
        });
    }
    // update access token and refresh token
    updateRefreshAccessToken(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const access_token_secret = (0, uuid_1.v4)();
            const refresh_token_secret = (0, uuid_1.v4)();
            const accessToken = lib_1.default.createToken(Object.assign(Object.assign({}, data), { type: 'access_token' }), access_token_secret, '1h');
            const refreshToken = lib_1.default.createToken(Object.assign(Object.assign({}, data), { type: 'refresh_token' }), refresh_token_secret, '1d');
            const update = yield this.db(this.table)
                .update({
                access_token_secret,
                refresh_token_secret,
            })
                .where('id', id);
            if (update) {
                return {
                    success: true,
                    data: { accessToken, refreshToken, uuid: id },
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot update token!',
                };
            }
        });
    }
    // delete secret by id
    deleteTokenSecretById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield this.db(this.table).delete().where('id', id);
            if (secret) {
                return {
                    success: true,
                    message: 'Secret deleted',
                };
            }
            else {
                return {
                    success: false,
                    message: 'No secret of this id',
                };
            }
        });
    }
    // delete all secret of an user
    deleteAllTokenSecretOfUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield this.db(this.table).delete().andWhere('user_id', id);
            if (secret) {
                return {
                    success: true,
                    message: 'Secret deleted',
                };
            }
            else {
                return {
                    success: false,
                    message: 'No secret of this id',
                };
            }
        });
    }
}
exports.default = TokenService;
//# sourceMappingURL=tokenService.js.map