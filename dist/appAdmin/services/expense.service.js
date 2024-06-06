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
exports.ExpenseService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
const expenseModel_1 = __importDefault(require("../../models/expenseModel/expenseModel"));
class ExpenseService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create Expense Head Service
    createExpenseHead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { name } = req.body;
                // expense head check
                const expenseModel = this.Model.expenseModel();
                const { data: checkHead } = yield expenseModel.getAllExpenseHead({
                    name,
                    hotel_id,
                });
                if (checkHead.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Same Expense Head already exists, give another unique Expense Head",
                    };
                }
                // model
                const model = new expenseModel_1.default(trx);
                const res = yield model.createExpenseHead({
                    hotel_id,
                    name,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Expense Head created successfully.",
                };
            }));
        });
    }
    // Get all Expense Head list
    getAllExpenseHead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { limit, skip, name } = req.query;
            const model = this.Model.expenseModel();
            const { data, total } = yield model.getAllExpenseHead({
                limit: limit,
                skip: skip,
                name: name,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // Update Expense Head Service
    updateExpenseHead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id } = req.hotel_admin;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.expenseModel(trx);
                const res = yield model.updateExpenseHead(parseInt(id), {
                    hotel_id,
                    name: updatePayload.name,
                });
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Expense Head updated successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Expense Head didn't find",
                    };
                }
            }));
        });
    }
    // Delete Expense Head Service
    deleteExpenseHead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.expenseModel(trx);
                const res = yield model.deleteExpenseHead(parseInt(id));
                if (res === 1) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: "Expense Head deleted successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Expense Head didn't find",
                    };
                }
            }));
        });
    }
    // Create Expense Service
    createExpense(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { hotel_id, id: created_by } = req.hotel_admin;
                const _a = req.body, { expense_item, ac_tr_ac_id } = _a, rest = __rest(_a, ["expense_item", "ac_tr_ac_id"]);
                const accountModel = this.Model.accountModel(trx);
                const model = this.Model.expenseModel(trx);
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
                const year = new Date().getFullYear();
                // get last voucher ID
                const voucherData = yield model.getAllIVoucherForLastId();
                const voucherNo = voucherData.length ? voucherData[0].id + 1 : 1;
                let expenseTotal = 0;
                expense_item.forEach((item) => {
                    expenseTotal += item.amount;
                });
                // Insert expense record
                const expenseRes = yield model.createExpense(Object.assign(Object.assign({}, rest), { voucher_no: `EXP-${year}${voucherNo}`, ac_tr_ac_id,
                    hotel_id,
                    created_by, total: expenseTotal }));
                const expenseItemPayload = expense_item.map((item) => {
                    return {
                        name: item.name,
                        amount: item.amount,
                        expense_id: expenseRes[0],
                    };
                });
                //   expense item
                yield model.createExpenseItem(expenseItemPayload);
                //   ====================== account transaction  step =================== //
                // Insert account transaction
                const transactionRes = yield accountModel.insertAccountTransaction({
                    ac_tr_ac_id,
                    ac_tr_cash_out: expenseTotal,
                });
                // Get the last ledger balance
                const ledgerLastBalance = yield accountModel.getAllLedgerLastBalanceByAccount({
                    hotel_id,
                    ledger_account_id: ac_tr_ac_id,
                });
                const available_balance = parseFloat(ledgerLastBalance) - expenseTotal;
                // Insert account ledger
                yield accountModel.insertAccountLedger({
                    ac_tr_id: transactionRes[0],
                    ledger_debit_amount: expenseTotal,
                    ledger_details: `Balance has been debited by expense, Expense id = ${expenseRes[0]}`,
                    ledger_balance: available_balance,
                });
                // update account last balance
                yield accountModel.upadateSingleAccount({ last_balance: available_balance }, { hotel_id, id: ac_tr_ac_id });
                const last_balance = checkAccount[0].last_balance;
                if (last_balance < expenseTotal) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Insufficient balance in this account for expense",
                    };
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Expense created successfully.",
                };
            }));
        });
    }
    // get all Expense service
    getAllExpense(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { from_date, to_date, limit, skip, key } = req.query;
            const model = this.Model.expenseModel();
            const { data, total } = yield model.getAllExpense({
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                key: key,
                hotel_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get single expense service
    getSingleExpense(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { hotel_id } = req.hotel_admin;
            const data = yield this.Model.expenseModel().getSingleExpense(parseInt(id), hotel_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
}
exports.ExpenseService = ExpenseService;
exports.default = ExpenseService;
//# sourceMappingURL=expense.service.js.map