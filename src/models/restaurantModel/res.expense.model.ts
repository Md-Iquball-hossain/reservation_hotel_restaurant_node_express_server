
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

import {
IinsertLedger,
IinsertSupplierLedger,
IupdateAccount,
} from "../../appAdmin/utlis/interfaces/account.interface";
import {
IAccountResCreateBody,
IinsertResTransaction,
} from "../../appRestaurant/utils/interfaces/account.interface";
import {
ICreateResExpenseHeadPayload,
ICreateResExpensePayload,
IUpdateResExpenseHeadPayload,
} from "../../appRestaurant/utils/interfaces/expense.interface";

    class RestaurantModel extends Schema {
    private db: TDB;

    constructor(db: TDB) {
        super();
        this.db = db;
    }

    //=================== Expense  ======================//

    // insert in inventory
    public async insertInInventory(
        payload: {
        res_id: number;
        ing_id: number;
        available_quantity: number;
        }[]
    ) {
        return await this.db("inventory")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // update in inventory
    public async updateInInventory(
        payload: {
        available_quantity: number;
        },
        where: { id: number }
    ) {
        return await this.db("inventory")
        .withSchema(this.RESTAURANT_SCHEMA)
        .update(payload)
        .where("id", where.id);
    }

    // get all inventory
    public async getAllInventory(where: { res_id: number; ing_ids: number[] }) {
        const { ing_ids, res_id } = where;
        return await this.db("inventory")
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("*")
        .where("res_id", res_id)
        .andWhere(function () {
            if (ing_ids) {
            this.whereIn("ing_id", ing_ids);
            }
        });
    }

    // Create Expense Head Model
    public async createExpenseHead(payload: ICreateResExpenseHeadPayload) {
        return await this.db("expense_head")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // Get All Expense Head Model
    public async getAllExpenseHead(payload: {
        limit?: string;
        skip?: string;
        name: string;
        res_id: number;
    }) {
    const { limit, skip, res_id, name } = payload;

    const dtbs = this.db("expense_head as eh");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select("eh.id", "eh.name")
    .where("res_id", res_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("eh.name", "like", `%${name}%`);
        }
    })
    .orderBy("eh.id", "desc");

    const total = await this.db("expense_head as eh")
    .withSchema(this.RESTAURANT_SCHEMA)
    .count("eh.id as total")
    .where("eh.res_id", res_id)
    .andWhere(function () {
        if (name) {
        this.andWhere("eh.name", "like", `%${name}%`);
        }
    });

    return { total: total[0].total, data };
    }

    // Update Expense Head Model
    public async updateExpenseHead(
        id: number,
        payload: IUpdateResExpenseHeadPayload
    ) {
        const expenseHeadUpdate = await this.db("expense_head")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .update(payload);

        return expenseHeadUpdate;
    }

    // Delete Expense Head Model
    public async deleteExpenseHead(id: number) {
        return await this.db("expense_head")
        .withSchema(this.RESTAURANT_SCHEMA)
        .where({ id })
        .del();
    }

    // Create Expense Model
    public async createExpense(payload: ICreateResExpensePayload) {
        return await this.db("expense")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // create expense item
    public async createExpenseItem(
        payload: {
        name: string;
        amount: number;
        expense_id: number;
        }[]
    ) {
        return await this.db("expense_item")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // get all expense for last id
    public async getAllExpenseForLastId() {
        return await this.db("expense")
        .select("id")
        .withSchema(this.RESTAURANT_SCHEMA)
        .orderBy("id", "desc")
        .limit(1);
    }

    // get All Expense Model
    public async getAllExpense(payload: {
        from_date: string;
        to_date: string;
        limit: string;
        skip: string;
        key: string;
        expense_category: string;
        res_id: number;
    }) {
    const { limit, skip, res_id, from_date, to_date, key, expense_category } =
    payload;

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("expense_view as ev");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .withSchema(this.RESTAURANT_SCHEMA)
    .select(
        "ev.id",
        "ev.voucher_no",
        "ev.name as expense_name",
        "a.name as account_name",
        "a.ac_type",
        "ev.total as expense_amount",
        "ev.expense_category",
        "ev.expense_date as expense_date"
    )
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

    const total = await this.db("expense_view as ev")
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
    }

    // get single Expense Model
    public async getSingleExpense(id: number, res_id: number) {
        const dtbs = this.db("expense_view as ev");
        const data = await dtbs
        .withSchema(this.RESTAURANT_SCHEMA)
        .select("*")
        .where("ev.id", id)
        .andWhere("ev.res_id", res_id);

        return data.length > 0 ? data[0] : [];
    }

    //=================== Account  ======================//

    // create account
    public async createAccount(payload: IAccountResCreateBody) {
        return await this.db("account")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // update account
    public async upadateSingleAccount(
        payload: IupdateAccount,
        where: { res_id: number; id: number }
    ) {
        const { res_id, id } = where;
        return await this.db("account")
        .withSchema(this.RESTAURANT_SCHEMA)
        .update(payload)
        .where({ res_id })
        .andWhere({ id });
    }

    // get all account
    public async getAllAccounts(payload: {
        res_id: number;
        status?: string;
        ac_type?: string;
        key?: string;
        limit?: string;
        skip?: string;
        admin_id?: number;
        acc_ids?: number[];
    }) {
    const { status, res_id, ac_type, key, limit, skip, admin_id, acc_ids } =
    payload;

    const dtbs = this.db("account as a");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
    .select(
        "a.id",
        "a.res_id",
        "a.name",
        "a.ac_type",
        "a.bank",
        "a.branch",
        "a.account_number",
        "a.details",
        "a.status",
        "a.last_balance as available_balance",
        "a.created_at"
    )
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

    const total = await this.db("account as a")
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
    }

    // get single account
    public async getSingleAccount(payload: {
        res_id: number;
        id: number;
        type?: string;
    }) {
        const { id, type, res_id } = payload;
        return await this.db("account_view")
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
    }

    // insert in account transaction
    public async insertAccountTransaction(payload: IinsertResTransaction) {
        return await this.db("acc_transaction")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // insert in account ledger
    public async insertAccountLedger(payload: IinsertLedger) {
        return await this.db("acc_ledger")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // insert in supplier ledger
    public async insertSupplierLedger(payload: IinsertSupplierLedger) {
        return await this.db("sup_ledger")
        .withSchema(this.RESTAURANT_SCHEMA)
        .insert(payload);
    }

    // get ledeger by account id
    public async getAllLedgerLastBalanceByAccount(payload: {
        res_id: number;
        ledger_account_id: number;
    }) {
        const { res_id, ledger_account_id } = payload;
        const result = await this.db.raw(
        `SELECT ${this.RESTAURANT_SCHEMA}.get_ledger_balance(?, ?) AS remaining_balance`,
        [res_id, ledger_account_id]
        );
        const remainingBalance = result[0][0].remaining_balance;
        return remainingBalance;
    }

    //=================== account  ======================//

    // Get All Account
    public async getAllAccount(payload: {
        res_id: number;
        status?: string;
        ac_type?: string;
        key?: string;
        limit?: string;
        skip?: string;
        admin_id?: number;
        acc_ids?: number[];
    }) {
    const { status, res_id, ac_type, key, limit, skip, admin_id, acc_ids } =
    payload;

    const dtbs = this.db("account_view as av");

    if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
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

    const total = await this.db("account_view as av")
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
    }

}
export default RestaurantModel;
