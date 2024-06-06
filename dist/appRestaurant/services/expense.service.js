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
exports.ExpenseResService = void 0;
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class ExpenseResService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create Expense Head Service
    createExpenseHead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id } = req.rest_user;
                const { name } = req.body;
                // expense head check
                const Model = this.Model.restaurantModel();
                const { data: checkHead } = yield Model.getAllExpenseHead({
                    name,
                    res_id,
                });
                if (checkHead.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Same Expense Head already exists, give another unique Expense Head",
                    };
                }
                yield Model.createExpenseHead({
                    res_id,
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
            const { res_id } = req.rest_user;
            const { limit, skip, name } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllExpenseHead({
                limit: limit,
                skip: skip,
                name: name,
                res_id,
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
                const { res_id } = req.rest_user;
                const { id } = req.params;
                const updatePayload = req.body;
                const model = this.Model.restaurantModel(trx);
                const res = yield model.updateExpenseHead(parseInt(id), {
                    res_id,
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
                const model = this.Model.restaurantModel(trx);
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
                const { res_id, id: created_by } = req.rest_user;
                const { expense_item, ac_tr_ac_id, expense_category, expense_date, remarks, name, } = req.body;
                const Model = this.Model.restaurantModel(trx);
                // account check
                const checkAccount = yield Model.getSingleAccount({
                    res_id,
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
                const voucherData = yield Model.getAllExpenseForLastId();
                const voucherNo = voucherData.length ? voucherData[0].id + 1 : 1;
                let expenseTotal = 0;
                expense_item.forEach((item) => {
                    expenseTotal += item.amount;
                });
                const last_balance = checkAccount[0].last_balance;
                if (last_balance < expenseTotal) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Insufficient balance in this account for expense",
                    };
                }
                // Insert expense record
                const expenseRes = yield Model.createExpense({
                    name,
                    remarks,
                    expense_date,
                    voucher_no: `EXP-${year}${voucherNo}`,
                    ac_tr_ac_id,
                    res_id,
                    created_by,
                    total: expenseTotal,
                });
                const expenseItemPayload = expense_item.map((item) => {
                    return {
                        name: item.name,
                        amount: item.amount,
                        expense_id: expenseRes[0],
                    };
                });
                //   expense item
                yield Model.createExpenseItem(expenseItemPayload);
                //   ====================== account transaction  step =================== //
                // Insert account transaction
                const transactionRes = yield Model.insertAccountTransaction({
                    res_id,
                    ac_tr_ac_id,
                    ac_tr_cash_out: expenseTotal,
                });
                // Get the last ledger balance
                const ledgerLastBalance = yield Model.getAllLedgerLastBalanceByAccount({
                    res_id,
                    ledger_account_id: ac_tr_ac_id,
                });
                const available_balance = parseFloat(ledgerLastBalance) - expenseTotal;
                // Insert account ledger
                yield Model.insertAccountLedger({
                    ac_tr_id: transactionRes[0],
                    ledger_debit_amount: expenseTotal,
                    ledger_details: `Balance has been debited by expense, Expense id = ${expenseRes[0]}`,
                    ledger_balance: available_balance,
                });
                // update account last balance
                yield Model.upadateSingleAccount({ last_balance: available_balance }, { res_id, id: ac_tr_ac_id });
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
            const { res_id } = req.rest_user;
            const { from_date, to_date, limit, skip, key, expense_category } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllExpense({
                expense_category: expense_category,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                key: key,
                res_id,
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
            const { res_id } = req.rest_user;
            const data = yield this.Model.restaurantModel().getSingleExpense(parseInt(id), res_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
}
exports.ExpenseResService = ExpenseResService;
exports.default = ExpenseResService;
//# sourceMappingURL=expense.service.js.map