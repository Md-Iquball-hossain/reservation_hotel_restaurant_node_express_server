import {
  ICreateExpenseHeadPayload,
  ICreateExpensePayload,
  IUpdateExpenseHeadPayload,
} from "../../appAdmin/utlis/interfaces/expense.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class ExpenseModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // Create Expense Head Model
  public async createExpenseHead(payload: ICreateExpenseHeadPayload) {
    return await this.db("expense_head")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All Expense Head Model
  public async getAllExpenseHead(payload: {
    limit?: string;
    skip?: string;
    name: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, name } = payload;

    const dtbs = this.db("expense_head as eh");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select("eh.id", "eh.name")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("eh.name", "like", `%${name}%`);
        }
      })
      .orderBy("eh.id", "desc");

    const total = await this.db("expense_head as eh")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("eh.id as total")
      .where("eh.hotel_id", hotel_id)
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
    payload: IUpdateExpenseHeadPayload
  ) {
    const expenseHeadUpdate = await this.db("expense_head")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);

    return expenseHeadUpdate;
  }

  // Delete Expense Head Model
  public async deleteExpenseHead(id: number) {
    return await this.db("expense_head")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

  // Create Expense Model
  public async createExpense(payload: ICreateExpensePayload) {
    return await this.db("expense")
      .withSchema(this.RESERVATION_SCHEMA)
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
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get all voucher last id
  public async getAllIVoucherForLastId() {
    return await this.db("expense")
      .select("id")
      .withSchema(this.RESERVATION_SCHEMA)
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
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, from_date, to_date, key } = payload;

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("expense_view as ev");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "ev.id",
        "ev.voucher_no",
        "ev.ac_tr_ac_id as account_id",
        "ev.expense_date as expense_date",
        "ev.name as expense_name",
        "a.name as account_name",
        "a.ac_type",
        "ev.total as expense_amount",
        "ev.created_at",
        "ev.expense_items"
      )
      .where("ev.hotel_id", hotel_id)
      .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ev.expense_date", [from_date, endDate]);
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
      .withSchema(this.RESERVATION_SCHEMA)
      .countDistinct("ev.id as total")
      .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
      .where("ev.hotel_id", hotel_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("ev.expense_date", [from_date, endDate]);
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
  public async getSingleExpense(id: number, hotel_id: number) {
    const dtbs = this.db("expense_view as ev");
    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "ev.id",
        "ev.hotel_id",
        "ev.voucher_no",
        "h.name as hotel_name",
        "h.address as hotel_address",
        "h.email as hotel_email",
        "h.phone as hotel_phone",
        "h.website as hotel_website",
        "h.logo as hotel_logo",
        "ev.name as expense_name",
        "a.name as account_name",
        "a.account_number",
        "a.ac_type",
        "ev.expense_date",
        "a.bank as bank_name",
        "a.branch",
        "ev.total as total_cost",
        "ev.remarks as expense_details",
        "ev.created_at as expense_created_at",
        "ev.expense_items"
      )

      .leftJoin("hotel as h", "ev.hotel_id", "h.id")
      .leftJoin("account as a", "ev.ac_tr_ac_id", "a.id")
      .leftJoin("acc_transaction as at", "ev.ac_tr_ac_id", "at.ac_tr_ac_id")
      .leftJoin("acc_ledger as al", "at.ac_tr_id", "al.ac_tr_id")
      .where("ev.id", id)
      .andWhere("ev.hotel_id", hotel_id);

    return data.length > 0 ? data[0] : [];
  }
}
export default ExpenseModel;
