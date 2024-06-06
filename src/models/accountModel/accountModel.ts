import {
  IAccountCreateBody,
  IinsertLedger,
  IinsertTransaction,
  IupdateAccount,
} from "../../appAdmin/utlis/interfaces/account.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class AccountModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // create account
  public async createAccount(payload: IAccountCreateBody) {
    return await this.db("account")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // update account
  public async upadateSingleAccount(
    payload: IupdateAccount,
    where: { hotel_id: number; id: number }
  ) {
    const { hotel_id, id } = where;
    return await this.db("account")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ hotel_id })
      .andWhere({ id });
  }

  // get all account
  public async getAllAccounts(payload: {
    hotel_id: number;
    status?: string;
    ac_type?: string;
    key?: string;
    limit?: string;
    skip?: string;
    admin_id?: number;
    acc_ids?: number[];
  }) {
    const { status, hotel_id, ac_type, key, limit, skip, admin_id, acc_ids } =
      payload;

    const dtbs = this.db("account as a");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .select(
        "a.id",
        "a.hotel_id",
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
      .withSchema(this.RESERVATION_SCHEMA)
      .where("a.hotel_id", hotel_id)
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
      .withSchema(this.RESERVATION_SCHEMA)
      .count("a.id as total")
      .where("a.hotel_id", hotel_id)
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
    hotel_id: number;
    id: number;
    type?: string;
  }) {
    const { id, type, hotel_id } = payload;
    return await this.db("account_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("*")
      .where("hotel_id", hotel_id)
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
  public async insertAccountTransaction(payload: IinsertTransaction) {
    return await this.db("acc_transaction")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // insert in account ledger
  public async insertAccountLedger(payload: IinsertLedger) {
    return await this.db("acc_ledger")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get ledeger by account id
  public async getAllLedgerLastBalanceByAccount(payload: {
    hotel_id: number;
    ledger_account_id: number;
  }) {
    const { hotel_id, ledger_account_id } = payload;
    const result = await this.db.raw(
      `SELECT ${this.RESERVATION_SCHEMA}.get_ledger_balance(?, ?) AS remaining_balance`,
      [hotel_id, ledger_account_id]
    );
    const remainingBalance = result[0][0].remaining_balance;
    return remainingBalance;
  }
}
export default AccountModel;
