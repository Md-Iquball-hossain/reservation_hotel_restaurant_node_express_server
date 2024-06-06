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
const abstract_service_1 = __importDefault(require("../../abstarcts/abstract.service"));
class PurchaseService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create purchase
    createPurchase(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { res_id, id: res_admin, name } = req.rest_user;
                const { purchase_items, purchase_date, supplier_id, ac_tr_ac_id, discount_amount, } = req.body;
                // Check account
                const model = this.Model.restaurantModel(trx);
                const checkSupplier = yield model.getSingleSupplier(supplier_id, res_id);
                if (!checkSupplier.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Invalid Supplier Information",
                    };
                }
                const checkAccount = yield model.getSingleAccount({
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
                const last_balance = checkAccount[0].last_balance;
                const sub_total = purchase_items.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0);
                const grand_total = sub_total - discount_amount;
                if (last_balance < grand_total) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Insufficient balance in this account for payment",
                    };
                }
                if (discount_amount > grand_total) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Discount amount cannot be greater than grand total",
                    };
                }
                // Account transaction
                const transactionRes = yield model.insertAccountTransaction({
                    res_id,
                    ac_tr_ac_id: ac_tr_ac_id,
                    ac_tr_cash_out: grand_total,
                });
                // Get last ledger balance
                const ledgerLastBalance = yield model.getAllLedgerLastBalanceByAccount({
                    res_id,
                    ledger_account_id: ac_tr_ac_id,
                });
                const available_balance = parseFloat(ledgerLastBalance) - grand_total;
                // Insert account ledger
                yield model.insertAccountLedger({
                    ac_tr_id: transactionRes[0],
                    ledger_debit_amount: grand_total,
                    ledger_details: `Balance Debited by Purchase`,
                    ledger_balance: available_balance,
                });
                // Insert supplier ledger
                yield model.insertSupplierLedger({
                    ac_tr_ac_id,
                    supplier_id,
                    res_id,
                    ac_tr_id: transactionRes[0],
                    ledger_credit_amount: grand_total,
                    ledger_details: `Balance credited for sell something`,
                });
                // Update account last balance
                yield model.upadateSingleAccount({ last_balance: available_balance }, { res_id, id: ac_tr_ac_id });
                //   insert purchase
                const createdPurchase = yield model.createPurchase({
                    res_id,
                    ac_tr_id: transactionRes[0],
                    purchase_date,
                    supplier_id,
                    ac_tr_ac_id,
                    sub_total,
                    discount_amount,
                    grand_total,
                });
                const purchaseId = createdPurchase[0];
                const purchaseItemsPayload = [];
                console.log({ purchase_items });
                for (let i = 0; i < purchase_items.length; i++) {
                    let found = false;
                    for (let j = 0; j < purchaseItemsPayload.length; j++) {
                        if (purchase_items[i].ingredient_id ==
                            purchaseItemsPayload[j].ingredient_id) {
                            found = true;
                            purchaseItemsPayload[j].quantity += purchase_items[i].quantity;
                            purchaseItemsPayload[j].price +=
                                purchase_items[i].price * purchase_items[i].quantity;
                            break;
                        }
                    }
                    if (!found) {
                        purchaseItemsPayload.push({
                            ingredient_id: purchase_items[i].ingredient_id,
                            name: purchase_items[i].name,
                            purchase_id: purchaseId,
                            price: purchase_items[i].price * purchase_items[i].quantity,
                            quantity: purchase_items[i].quantity,
                        });
                    }
                }
                //   insert purchase item
                yield model.createPurchaseItem(purchaseItemsPayload);
                // =================== inventory step =================//
                const modifyInventoryIngredient = [];
                const addedInventoryIngredient = [];
                const purchase_ing_ids = purchase_items.map((item) => item.ingredient_id);
                const getInventoryIngredient = yield model.getAllInventory({
                    res_id,
                    ing_ids: purchase_ing_ids,
                });
                for (let i = 0; i < purchaseItemsPayload.length; i++) {
                    let found = false;
                    for (let j = 0; j < (getInventoryIngredient === null || getInventoryIngredient === void 0 ? void 0 : getInventoryIngredient.length); j++) {
                        if (purchaseItemsPayload[i].ingredient_id ==
                            getInventoryIngredient[j].ing_id) {
                            found = true;
                            modifyInventoryIngredient.push({
                                available_quantity: getInventoryIngredient[j].available_quantity +
                                    purchaseItemsPayload[i].quantity,
                                id: getInventoryIngredient[j].id,
                            });
                            break;
                        }
                    }
                    if (!found) {
                        addedInventoryIngredient.push({
                            res_id,
                            available_quantity: purchaseItemsPayload[i].quantity,
                            ing_id: purchaseItemsPayload[i].ingredient_id,
                        });
                    }
                }
                // insert in inventory
                if (addedInventoryIngredient.length) {
                    yield model.insertInInventory(addedInventoryIngredient);
                }
                console.log({ modifyInventoryIngredient });
                if (modifyInventoryIngredient.length) {
                    Promise.all(modifyInventoryIngredient.map((item) => __awaiter(this, void 0, void 0, function* () {
                        yield model.updateInInventory({ available_quantity: item.available_quantity }, { id: item.id });
                    })));
                }
                // =================== inventory step end =================//
                const year = new Date().getFullYear();
                // Get the last voucher ID
                const voucherData = yield model.getAllExpenseForLastId();
                const voucherNo = voucherData.length ? voucherData[0].id + 1 : 1;
                // Insert expense record
                const expenseRes = yield model.createExpense({
                    res_id,
                    name,
                    ac_tr_ac_id,
                    remarks: "Expense for purchase product",
                    expense_category: "food",
                    expense_date: purchase_date,
                    voucher_no: `EXP-${year}${voucherNo}-p${purchaseId}`,
                    created_by: res_admin,
                    total: grand_total,
                });
                const ExpenseItems = purchase_items.map((item) => ({
                    name: item.name,
                    amount: item.price * item.quantity,
                    expense_id: expenseRes[0],
                }));
                yield model.createExpenseItem(ExpenseItems);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Purchase created successfully.",
                };
            }));
        });
    }
    // Get all Purchase
    getAllPurchase(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id } = req.rest_user;
            const { limit, skip } = req.query;
            const model = this.Model.restaurantModel();
            const { data, total } = yield model.getAllpurchase({
                limit: limit,
                skip: skip,
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
    // Get Single Purchase
    getSinglePurchase(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { res_id } = req.rest_user;
            const data = yield this.Model.restaurantModel().getSinglePurchase(parseInt(id), res_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
    // Get all Account
    getAllAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotel_id } = req.hotel_admin;
            const { ac_type, key, status, limit, skip, admin_id } = req.query;
            // model
            const model = this.Model.accountModel();
            const { data, total } = yield model.getAllAccounts({
                hotel_id,
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
}
exports.default = PurchaseService;
//# sourceMappingURL=purchase.service.js.map