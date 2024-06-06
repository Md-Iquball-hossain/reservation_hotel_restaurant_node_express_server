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
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class RestaurantAccountService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create Account
    createAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id, id } = req.rest_user;
                const _a = req.body, { opening_balance } = _a, rest = __rest(_a, ["opening_balance"]);
                // model
                const model = this.Model.restaurantModel(trx);
                // insert account
                const res = yield model.createAccount(Object.assign(Object.assign({}, rest), { last_balance: opening_balance, res_id, created_by: id }));
                // insert in account transaction
                const transactionRes = yield model.insertAccountTransaction({
                    ac_tr_ac_id: res[0],
                    res_id,
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
            const { res_id } = req.rest_user;
            const { ac_type, key, status, limit, skip, admin_id } = req.query;
            // model
            const model = this.Model.restaurantModel();
            // fetch all accounts for the given hotel_id
            const { data, total } = yield model.getAllAccounts({
                res_id,
                status: status,
                ac_type: ac_type,
                key: key,
                limit: limit,
                skip: skip,
                admin_id: parseInt(admin_id),
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // update account
    updateAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = req.rest_user;
            const id = parseInt(req.params.id);
            const _a = req.body, { last_balance } = _a, rest = __rest(_a, ["last_balance"]);
            const model = this.Model.restaurantModel();
            yield model.upadateSingleAccount(Object.assign(Object.assign({}, rest), { res_id,
                last_balance }), { res_id, id });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: "Account updated successfully.",
            };
        });
    }
    // balance transfer
    balanceTransfer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, res_id } = req.rest_user;
            const { from_account, to_account, pay_amount } = req.body;
            // check account
            // model
            const model = this.Model.restaurantModel();
            // check from account
            const checkFromAcc = yield model.getSingleAccount({
                res_id,
                id: from_account,
            });
            if (!checkFromAcc.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: "From account not found",
                };
            }
            // check to account
            const checkToAcc = yield model.getSingleAccount({
                res_id,
                id: to_account,
            });
            if (!checkToAcc.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: "To account not found",
                };
            }
            const { last_balance: from_acc_last_balance } = checkFromAcc[0];
            const { last_balance: to_acc_last_balance } = checkToAcc[0];
            if (pay_amount > from_acc_last_balance) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "Pay amount is more than accounts balance",
                };
            }
            //=========== from account step ==========//
            // now insert account transaction
            const transactionRes = yield model.insertAccountTransaction({
                res_id,
                ac_tr_ac_id: from_account,
                ac_tr_cash_out: pay_amount,
            });
            const accLedgerLastBalance = yield model.getAllLedgerLastBalanceByAccount({
                res_id,
                ledger_account_id: from_account,
            });
            const nowLedgerBalance = parseFloat(accLedgerLastBalance) - pay_amount;
            // now inset in account ledger
            yield model.insertAccountLedger({
                ac_tr_id: transactionRes[0],
                ledger_debit_amount: pay_amount,
                ledger_balance: nowLedgerBalance,
                ledger_details: `Balance transfer to ${to_account}, total pay amount is = ${pay_amount}`,
            });
            // account update
            const nowFrmAccBlnc = parseFloat(from_acc_last_balance) - pay_amount;
            yield model.upadateSingleAccount({
                last_balance: nowFrmAccBlnc,
            }, { id: from_account, res_id });
            //=========== to account step ==========//
            // now insert account transaction
            const toAcctransactionRes = yield model.insertAccountTransaction({
                res_id,
                ac_tr_ac_id: to_account,
                ac_tr_cash_in: pay_amount,
            });
            const toAccLedgerLastBalance = yield model.getAllLedgerLastBalanceByAccount({
                res_id,
                ledger_account_id: to_account,
            });
            console.log({ toAccLedgerLastBalance });
            const nowToAccLedgerBalance = parseFloat(toAccLedgerLastBalance) + pay_amount;
            console.log({ nowToAccLedgerBalance });
            // now insert in account ledger
            yield model.insertAccountLedger({
                ac_tr_id: toAcctransactionRes[0],
                ledger_credit_amount: pay_amount,
                ledger_balance: nowToAccLedgerBalance,
                ledger_details: `Balance transfered from ${from_account}, total paid amount is = ${pay_amount}`,
            });
            console.log({ to_acc_last_balance });
            // account update
            const nowToAccBlnc = parseFloat(to_acc_last_balance) + pay_amount;
            console.log({ nowToAccBlnc });
            yield model.upadateSingleAccount({
                last_balance: nowToAccBlnc,
            }, { id: to_account, res_id });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: "Balance transfered",
            };
        });
    }
}
exports.default = RestaurantAccountService;
//# sourceMappingURL=account.service.js.map