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
class ResCommonModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //=================== Supplier  ======================//
    // create Supplier
    createSupplier(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("supplier")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Supplier
    getAllSupplier(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, name, status } = payload;
            const dtbs = this.db("supplier as s");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("s.id", "s.name", "s.phone", "s.status")
                .where("s.res_id", res_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("s.name", "like", `%${name}%`);
                }
                if (status) {
                    this.andWhere("s.status", "like", `%${status}%`);
                }
            })
                .orderBy("s.id", "desc");
            const total = yield this.db("supplier as s")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("s.id as total")
                .where("s.res_id", res_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("s.name", "like", `%${name}%`);
                }
                if (status) {
                    this.andWhere("s.status", "like", `%${status}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // get single supplier
    getSingleSupplier(id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("supplier as s")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("s.id", id)
                .andWhere("s.res_id", res_id);
        });
    }
    // Update supplier
    updateSupplier(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("supplier")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // Delete supplier
    deleteSupplier(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("supplier")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //=================== Restaurant  ======================//
    // get single hotel
    getSingleRes(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db("Res_view")
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
    // create Restaurant
    createRestaurant(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("restaurant")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // create Restaurant user
    createResAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_admin")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // get Restaurant email
    getAllResAdminEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, hotel_id } = payload;
            const dtbs = this.db("res_admin as ra");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ "ra.hotel_id": hotel_id })
                .andWhere({ "ra.email": email })
                .orderBy("id", "desc");
            return data.length > 0 ? data[0] : null;
        });
    }
    // get all Restaurant of a hotel
    getAllRestaurant(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip, hotel_id, res_email } = payload;
            const dtbs = this.db("restaurant as r");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("r.id as res_id", "r.name", "r.email as res_email", "r.status as res_status", "r.phone")
                .where("r.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("r.name", "like", `%${key}%`).orWhere("r.email", "like", `%${key}%`);
                }
            })
                .orderBy("r.id", "desc");
            const total = yield this.db("restaurant as r")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("r.id as total")
                .where("r.hotel_id", hotel_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("r.name", "like", `%${key}%`).orWhere("r.email", "like", `%${key}%`);
                }
            })
                .orderBy("r.id", "desc");
            return { total: total[0].total, data };
        });
    }
    // Get single Restaurant profile
    getResAdmin(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, hotel_id } = where;
            return yield this.db("res_admin as ra")
                .select("ra.id", "ra.res_id", "r.photo as logo", "r.name as res_name", "r.email as res_email", "r.phone as res_phone", "r.address as res_address", "r.city as res_city", "r.country as res_country", "r.bin_no as trade_licence", "r.status as res_status", "ra.name as admin_name", "ra.avatar as admin_photo", "ra.phone as admin_phone", "ra.email as admin_email", "ra.status as admin_status")
                .withSchema(this.RESTAURANT_SCHEMA)
                .leftJoin("restaurant as r", "ra.res_id", "r.id")
                .where("ra.hotel_id", hotel_id)
                .andWhere("ra.res_id", res_id);
        });
    }
    // Get single Restaurant Admin
    getSingleResAdmin(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id, hotel_id } = where;
            return yield this.db("res_admin as ra")
                .select("*")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where(function () {
                if (id) {
                    this.where("ra.id", id);
                }
                if (email) {
                    this.where("ra.email", email);
                }
                if (hotel_id) {
                    this.andWhere("ra.hotel_id", hotel_id);
                }
            });
        });
    }
    updateRestaurant(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("restaurant as r")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where("r.id", id)
                .update(payload);
        });
    }
    updateResAdmin(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("res_admin")
                .withSchema(this.RESTAURANT_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    //=================== Employee  ======================//
    // get all Employee
    getAllEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, hotel_id, res_id, key, } = payload;
            const dtbs = this.db("employee_view as ev");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("ev.hotel_id", hotel_id)
                .andWhere("ev.res_id", res_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("ev.department", "like", `%${key}%`)
                        .orWhere("ev.designation", "like", `%${key}%`)
                        .orWhere("ev.name", "like", `%${key}%`);
                }
            })
                .orderBy("ev.id", "desc");
            const total = yield this.db("employee_view as ev")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("ev.id as total")
                .where("ev.hotel_id", hotel_id)
                .andWhere("ev.res_id", res_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("ev.department", "like", `%${key}%`)
                        .orWhere("ev.designation", "like", `%${key}%`)
                        .orWhere("ev.name", "like", `%${key}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    //=================== Guest  ======================//
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
                .withSchema(this.RESTAURANT_SCHEMA)
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
                .withSchema(this.RESTAURANT_SCHEMA)
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
    //=================== Expense  ======================//
    // insert in inventory
    insertInInventory(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("inventory")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // update in inventory
    updateInInventory(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("inventory")
                .withSchema(this.RESTAURANT_SCHEMA)
                .update(payload)
                .where("id", where.id);
        });
    }
    // get all inventory
    getAllInventory(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ing_ids, res_id } = where;
            return yield this.db("inventory")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("res_id", res_id)
                .andWhere(function () {
                if (ing_ids) {
                    this.whereIn("ing_id", ing_ids);
                }
            });
        });
    }
    // Create Expense Head Model
    createExpenseHead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense_head")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // Get All Expense Head Model
    getAllExpenseHead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, name } = payload;
            const dtbs = this.db("expense_head as eh");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("eh.id", "eh.name")
                .where("res_id", res_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("eh.name", "like", `%${name}%`);
                }
            })
                .orderBy("eh.id", "desc");
            const total = yield this.db("expense_head as eh")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("eh.id as total")
                .where("eh.res_id", res_id)
                .andWhere(function () {
                if (name) {
                    this.andWhere("eh.name", "like", `%${name}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // Update Expense Head Model
    updateExpenseHead(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const expenseHeadUpdate = yield this.db("expense_head")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .update(payload);
            return expenseHeadUpdate;
        });
    }
    // Delete Expense Head Model
    deleteExpenseHead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense_head")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where({ id })
                .del();
        });
    }
    // Create Expense Model
    createExpense(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // create expense item
    createExpenseItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense_item")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // get all expense for last id
    getAllExpenseForLastId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("expense")
                .select("id")
                .withSchema(this.RESTAURANT_SCHEMA)
                .orderBy("id", "desc")
                .limit(1);
        });
    }
    // get All Expense Model
    getAllExpense(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, res_id, from_date, to_date, key, expense_category } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("expense_view as ev");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("ev.id", "ev.voucher_no", "ev.name as expense_name", "a.name as account_name", "a.ac_type", "ev.total as expense_amount", "ev.expense_category", "ev.expense_date as expense_date")
                .where("ev.res_id", res_id)
                .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("ev.expense_date", [from_date, endDate]);
                }
                if (expense_category) {
                    this.andWhere({ expense_category });
                }
                if (key) {
                    this.andWhere((builder) => {
                        builder
                            .orWhere("ev.name", "like", `%${key}%`)
                            .orWhere("a.name", "like", `%${key}%`);
                    });
                }
            })
                .groupBy("ev.id")
                .orderBy("ev.id", "desc");
            const total = yield this.db("expense_view as ev")
                .withSchema(this.RESTAURANT_SCHEMA)
                .countDistinct("ev.id as total")
                .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
                .where("ev.res_id", res_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("ev.expense_date", [from_date, endDate]);
                }
                if (expense_category) {
                    this.andWhere({ expense_category });
                }
                if (key) {
                    this.andWhere((builder) => {
                        builder
                            .orWhere("ev.name", "like", `%${key}%`)
                            .orWhere("a.name", "like", `%${key}%`);
                    });
                }
            })
                .first();
            return { data, total: total ? total.total : 0 };
        });
    }
    // get single Expense Model
    getSingleExpense(id, res_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("expense_view as ev");
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("ev.id", id)
                .andWhere("ev.res_id", res_id);
            return data.length > 0 ? data[0] : [];
        });
    }
    //=================== Account  ======================//
    // create account
    createAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("account")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // update account
    upadateSingleAccount(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, id } = where;
            return yield this.db("account")
                .withSchema(this.RESTAURANT_SCHEMA)
                .update(payload)
                .where({ res_id })
                .andWhere({ id });
        });
    }
    // get all account
    getAllAccounts(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, res_id, ac_type, key, limit, skip, admin_id, acc_ids } = payload;
            const dtbs = this.db("account as a");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("a.id", "a.res_id", "a.name", "a.ac_type", "a.bank", "a.branch", "a.account_number", "a.details", "a.status", "a.last_balance as available_balance", "a.created_at")
                .withSchema(this.RESTAURANT_SCHEMA)
                .where("a.res_id", res_id)
                .andWhere(function () {
                if (status) {
                    this.where({ status });
                }
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
                if (admin_id) {
                    this.andWhere({ created_by: admin_id });
                }
                if (acc_ids) {
                    this.whereIn("id", acc_ids);
                }
            })
                .andWhere(function () {
                if (key) {
                    this.andWhere("a.name", "like", `%${key}%`)
                        .orWhere("a.account_number", "like", `%${key}%`)
                        .orWhere("a.bank", "like", `%${key}%`);
                }
            })
                .orderBy("a.id", "desc");
            const total = yield this.db("account as a")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("a.id as total")
                .where("a.res_id", res_id)
                .andWhere(function () {
                if (status) {
                    this.where({ status });
                }
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
                if (admin_id) {
                    this.andWhere({ created_by: admin_id });
                }
                if (acc_ids) {
                    this.whereIn("id", acc_ids);
                }
            })
                .andWhere(function () {
                if (key) {
                    this.andWhere("a.name", "like", `%${key}%`)
                        .orWhere("a.account_number", "like", `%${key}%`)
                        .orWhere("a.bank", "like", `%${key}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    // get single account
    getSingleAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, type, res_id } = payload;
            return yield this.db("account_view")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("res_id", res_id)
                .andWhere(function () {
                if (id) {
                    this.andWhere({ id });
                }
                if (type) {
                    this.andWhere("ac_type", "like", `%${type}%`);
                }
            });
        });
    }
    // insert in account transaction
    insertAccountTransaction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("acc_transaction")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // insert in account ledger
    insertAccountLedger(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("acc_ledger")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // insert in supplier ledger
    insertSupplierLedger(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("sup_ledger")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // get ledeger by account id
    getAllLedgerLastBalanceByAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, ledger_account_id } = payload;
            const result = yield this.db.raw(`SELECT ${this.RESTAURANT_SCHEMA}.get_ledger_balance(?, ?) AS remaining_balance`, [res_id, ledger_account_id]);
            const remainingBalance = result[0][0].remaining_balance;
            return remainingBalance;
        });
    }
    // Get All Account
    getAllAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, res_id, ac_type, key, limit, skip, admin_id, acc_ids } = payload;
            const dtbs = this.db("account_view as av");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("*")
                .where("av.res_id", res_id)
                .andWhere(function () {
                if (status) {
                    this.where({ status });
                }
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
                if (admin_id) {
                    this.andWhere({ created_by: admin_id });
                }
                if (acc_ids) {
                    this.whereIn("id", acc_ids);
                }
            })
                .andWhere(function () {
                if (key) {
                    this.andWhere("a.name", "like", `%${key}%`)
                        .orWhere("a.account_number", "like", `%${key}%`)
                        .orWhere("a.bank", "like", `%${key}%`);
                }
            })
                .orderBy("av.id", "desc");
            const total = yield this.db("account_view as av")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("av.id as total")
                .where("av.res_id", res_id)
                .andWhere(function () {
                if (status) {
                    this.where({ status });
                }
                if (ac_type) {
                    this.andWhere({ ac_type });
                }
                if (admin_id) {
                    this.andWhere({ created_by: admin_id });
                }
                if (acc_ids) {
                    this.whereIn("id", acc_ids);
                }
            })
                .andWhere(function () {
                if (key) {
                    this.andWhere("a.name", "like", `%${key}%`)
                        .orWhere("a.account_number", "like", `%${key}%`)
                        .orWhere("a.bank", "like", `%${key}%`);
                }
            });
            return { total: total[0].total, data };
        });
    }
    //=================== invoice  ======================//
    // Get all invoice
    getAllInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, res_id, from_date, to_date, limit, skip, due_inovice } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("inv_view as iv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("iv.id", "iv.user_name", "iv.invoice_no", "iv.type", "iv.discount_amount", "iv.tax_amount", "iv.sub_total", "iv.grand_total", "iv.due", "iv.created_at")
                .leftJoin("res_admin as ra", "iv.created_by", "ra.id")
                .where("iv.res_id", res_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("invoice_no", "like", `%${key}%`).orWhere("u.name", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("iv.created_at", [from_date, endDate]);
                }
                if (due_inovice) {
                    this.andWhere("iv.due", ">", 0);
                }
            })
                .orderBy("iv.id", "desc");
            const total = yield this.db("inv_view as iv")
                .withSchema(this.RESTAURANT_SCHEMA)
                .count("iv.id as total")
                .leftJoin("res_admin as ra", "iv.created_by", "ra.id")
                .where("iv.res_id", res_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("invoice_no", "like", `%${key}%`).orWhere("u.name", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (due_inovice) {
                    this.andWhere("iv.due", ">", 0);
                }
            });
            return { data, total: total[0].total };
        });
    }
    // get all invoice for last id
    getAllInvoiceForLastId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("invoice")
                .select("id")
                .withSchema(this.RESTAURANT_SCHEMA)
                .orderBy("id", "desc")
                .limit(1);
        });
    }
    // Get single invoice
    getSingleInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { res_id, id } = payload;
            return yield this.db("inv_view")
                .withSchema(this.RESTAURANT_SCHEMA)
                .select("id", "invoice_no", "res_address", "res_email", "res_phone", "res_logo", "user_name", "created_by_name as created_by", "type", "discount_amount", "tax_amount", "sub_total", "grand_total", "due", "description", "created_at", "invoice_items")
                .where({ res_id: res_id })
                .andWhere({ id: id });
        });
    }
    // insert hotel invoice
    insertResInvoice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("invoice")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
    // update hotel invoice
    updateResInvoice(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { due } = payload;
            const { hotel_id, id } = where;
            return yield this.db("invoice")
                .withSchema(this.RESTAURANT_SCHEMA)
                .update(payload)
                .where({ id })
                .andWhere({ hotel_id });
        });
    }
    // insert hotel invoice item
    insertResInvoiceItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("invoice_item")
                .withSchema(this.RESTAURANT_SCHEMA)
                .insert(payload);
        });
    }
}
exports.default = ResCommonModel;
//# sourceMappingURL=res.common.model.js.map