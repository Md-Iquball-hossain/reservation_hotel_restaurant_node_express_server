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
exports.AccountService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class AccountService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create Account
    createAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const _a = req.body, { opening_balance } = _a, rest = __rest(_a, ["opening_balance"]);
                // model
                const model = this.Model.accountModel(trx);
                // insert account
                const res = yield model.createAccount(Object.assign(Object.assign({}, rest), { hotel_id }));
                // insert in account transaction
                const transactionRes = yield model.insertAccountTransaction({
                    ac_tr_ac_id: res[0],
                    ac_tr_cash_in: opening_balance,
                });
                // insert in account ledger
                yield model.insertAccountLedger({
                    ac_tr_id: transactionRes[0],
                    ledger_credit_amount: opening_balance,
                    ledger_balance: opening_balance,
                    ledger_details: `Opening balance has been credited for ${rest.name} account`,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Account created successfully.",
                };
            }));
        });
    }
    // get all accounts
    getAllAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { ac_type, key, status, limit, skip } = req.query;
            // model
            const model = this.Model.accountModel();
            // fetch all accounts for the given hotel_id
            const { data, total } = yield model.getAllAccounts({
                hotel_id,
                status: status,
                ac_type: ac_type,
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
}
exports.AccountService = AccountService;
exports.default = AccountService;
//# sourceMappingURL=account.service%20copy.js.map