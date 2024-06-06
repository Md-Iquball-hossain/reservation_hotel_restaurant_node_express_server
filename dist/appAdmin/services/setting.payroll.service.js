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
class PayRollSettingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //=================== Payrool Service ======================//
    // create Payrool
    createPayRoll(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const _a = req.body, { total_salary, ac_tr_ac_id } = _a, rest = __rest(_a, ["total_salary", "ac_tr_ac_id"]);
                const files = req.files || [];
                if (files.length) {
                    rest['docs'] = files[0].filename;
                }
                const accountModel = this.Model.accountModel(trx);
                // account check
                const checkAccount = yield accountModel.getSingleAccount({
                    hotel_id,
                    id: ac_tr_ac_id,
                });
                if (!checkAccount.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Account not found",
                    };
                }
                const model = this.Model.payRollModel(trx);
                // Insert expense record
                const employeeIds = yield model.CreatePayRoll(Object.assign(Object.assign({}, rest), { ac_tr_ac_id,
                    hotel_id, total_salary: total_salary }));
                //   ====================== account transaction  step =================== //
                // Insert account transaction
                const transactionRes = yield accountModel.insertAccountTransaction({
                    ac_tr_ac_id,
                    ac_tr_cash_out: total_salary,
                });
                // Get the last ledger balance
                const ledgerLastBalance = yield accountModel.getAllLedgerLastBalanceByAccount({
                    hotel_id,
                    ledger_account_id: ac_tr_ac_id,
                });
                const available_balance = parseFloat(ledgerLastBalance) - total_salary;
                // Insert account ledger
                yield accountModel.insertAccountLedger({
                    ac_tr_id: transactionRes[0],
                    ledger_debit_amount: total_salary,
                    ledger_details: `Employee Salary by PayRoll, Employee id = ${employeeIds[0]}`,
                    ledger_balance: available_balance,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "PayRoll created successfully.",
                };
            }));
        });
    }
}
exports.default = PayRollSettingService;
//# sourceMappingURL=setting.payroll.service.js.map