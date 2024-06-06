import {
  IcreateMoneyReciept,
  IinsertMoneyRecieptItem,
  IinsertinvoiceItemPayload,
  IinsertinvoicePayload,
  updateSingleInvoice,
} from "../../appAdmin/utlis/interfaces/invoice.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class HotelInvoiceModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //   insert hotel invoice
  public async insertHotelInvoice(payload: IinsertinvoicePayload) {
    return await this.db("invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // update hotel invoice

  public async updateHotelInvoice(
    payload: { due: number },
    where: { id: number; hotel_id: number }
  ) {
    const { due } = payload;
    const { hotel_id, id } = where;

    return await this.db("invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ id })
      .andWhere({ hotel_id });
  }

  public async updateRoomBookingInvoice(
    payload: {
      due: number;
      discount_amount: number;
      grand_total: number;
      tax_amount: number;
      sub_total: number;
    },
    where: { id: number; hotel_id: number }
  ) {
    const { hotel_id, id } = where;
    return await this.db("invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ id })
      .andWhere({ hotel_id });
  }

  // insert hotel invoice item
  public async updateBookingUpdateInvoice(
    payload: { due: number; grand_total?: number; sub_total?: number },
    where: { id: number; hotel_id: number }
  ) {
    const { hotel_id, id } = where;
    return await this.db("invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ id })
      .andWhere({ hotel_id: hotel_id });
  }

  // get sub invoice
  public async getRoomBookingSubInv(id: number) {
    return await this.db("room_booking_sub_invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("*")
      .where("room_booking_id", id)
      .first();
  }

  // insert hotel invoice item
  public async insertHotelInvoiceItem(payload: IinsertinvoiceItemPayload[]) {
    return await this.db("invoice_item")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get all invoice
  public async getAllInvoice(payload: {
    key?: string;
    hotel_id: number;
    user_id?: string;
    from_date?: string;
    to_date?: string;
    limit?: string;
    skip?: string;
    due_inovice?: string;
  }) {
    const {
      key,
      hotel_id,
      user_id,
      from_date,
      to_date,
      limit,
      skip,
      due_inovice,
    } = payload;
    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("inv_view as iv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }
    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "iv.invoice_id",
        "u.id",
        "u.name as user_name",
        "iv.invoice_no",
        "iv.type",
        "iv.discount_amount",
        "iv.tax_amount",
        "iv.sub_total",
        "iv.grand_total",
        "iv.due",
        "iv.created_at",
        "ua.name as created_by"
      )
      .leftJoin("user as u", "iv.user_id", "u.id")
      .leftJoin("user_admin as ua", "iv.created_by", "ua.id")
      .where("iv.hotel_id", hotel_id)
      .andWhere(function () {
        if (key) {
          this.andWhere("invoice_no", "like", `%${key}%`).orWhere(
            "u.name",
            "like",
            `%${key}%`
          );
        }
      })
      .andWhere(function () {
        if (user_id) {
          this.andWhere("iv.user_id", user_id);
        }
        if (from_date && to_date) {
          this.andWhereBetween("iv.created_at", [from_date, endDate]);
        }
        if (due_inovice) {
          this.andWhere("iv.due", ">", 0);
        }
      })
      .orderBy("iv.invoice_id", "desc");

    const total = await this.db("inv_view as iv")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("invoice_id as total")
      .leftJoin("user as u", "iv.user_id", "u.id")
      .leftJoin("user_admin as ua", "iv.created_by", "ua.id")
      .where("iv.hotel_id", hotel_id)
      .andWhere(function () {
        if (key) {
          this.andWhere("invoice_no", "like", `%${key}%`).orWhere(
            "u.name",
            "like",
            `%${key}%`
          );
        }
      })
      .andWhere(function () {
        if (user_id) {
          this.andWhere("iv.user_id", user_id);
        }
        if (due_inovice) {
          this.andWhere("iv.due", ">", 0);
        }
      });

    return { data, total: total[0].total };
  }

  // get all invoice for money reciept
  public async getAllInvoiceForMoneyReciept(payload: {
    key?: string;
    hotel_id: number;
    user_id?: string;
    from_date?: string;
    to_date?: string;
    limit?: string;
    skip?: string;
    due_inovice?: string;
  }) {
    const {
      key,
      hotel_id,
      user_id,
      from_date,
      to_date,
      limit,
      skip,
      due_inovice,
    } = payload;
    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("invoice as iv");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }
    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "iv.id as invoice_id",
        "iv.invoice_no",
        "iv.discount_amount",
        "iv.tax_amount",
        "iv.sub_total",
        "iv.grand_total",
        "iv.due"
      )
      .leftJoin("user as u", "iv.user_id", "u.id")
      .leftJoin("user_admin as ua", "iv.created_by", "ua.id")
      .where("iv.hotel_id", hotel_id)
      .andWhere(function () {
        if (key) {
          this.andWhere("invoice_no", "like", `%${key}%`).orWhere(
            "u.name",
            "like",
            `%${key}%`
          );
        }
      })
      .andWhere(function () {
        if (user_id) {
          this.andWhere("iv.user_id", user_id);
        }
        if (from_date && to_date) {
          this.andWhereBetween("iv.created_at", [from_date, endDate]);
        }
        if (due_inovice) {
          this.andWhere("iv.due", ">", 0);
        }
      })
      .orderBy("iv.id", "desc");

    return data;
  }

  // Get single invoice
  public async getSingleInvoice(payload: {
    hotel_id: number;
    invoice_id: number;
    user_id?: number;
  }) {
    const { hotel_id, invoice_id, user_id } = payload;
    return await this.db("inv_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "invoice_id",
        "invoice_no",
        "hotel_address",
        "hotel_email",
        "hotel_phone",
        "hotel_website",
        "hotel_logo",
        "user_name",
        "created_by_name",
        "type",
        "discount_amount",
        "tax_amount",
        "sub_total",
        "grand_total",
        "due",
        "description",
        "created_at",
        "invoice_items"
      )
      .where({ hotel_id: hotel_id })
      .andWhere({ invoice_id: invoice_id })
      .andWhere(function () {
        if (user_id) {
          this.andWhere("user_id", user_id);
        }
      });
  }

  // sub invoice id
  public async getSingleRoomBookingSubInv(room_booking_id: number) {
    const subInvoice = await this.db("room_booking_sub_invoice")
      .select("*")
      .where("room_booking_id", room_booking_id)
      .first();
  }

  public async updateSingleInvoice(
    payload: updateSingleInvoice,
    where: { hotel_id: number; id: number }
  ) {
    const { hotel_id, id } = where;
    return await this.db("invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ hotel_id })
      .andWhere({ id });
  }

  // get single invoice by invoice table
  public async getSpecificInvoiceForMoneyReciept(payload: {
    hotel_id: number;
    invoice_id: number;
    user_id?: number;
  }) {
    const { hotel_id, invoice_id, user_id } = payload;

    return await this.db("invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "id",
        "discount_amount",
        "tax_amount",
        "sub_total",
        "grand_total",
        "due"
      )
      .where({ hotel_id: hotel_id })
      .andWhere({ id: invoice_id })
      .andWhere(function () {
        if (user_id) {
          this.andWhere("user_id", user_id);
        }
      });
  }

  // get all invoice for last id
  public async getAllInvoiceForLastId() {
    return await this.db("invoice")
      .select("id")
      .withSchema(this.RESERVATION_SCHEMA)
      .orderBy("id", "desc")
      .limit(1);
  }

  // create money reciept
  public async createMoneyReciept(payload: IcreateMoneyReciept) {
    return await this.db("money_receipt")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // insert money reciept item
  public async insertMoneyRecieptItem(payload: IinsertMoneyRecieptItem) {
    return await this.db("money_reciept_item")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get all money reciept for last id
  public async getAllMoneyRecieptFoLastId() {
    return await this.db("money_receipt")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("id")
      .orderBy("id", "desc")
      .limit(1);
  }

  // get all money reciept
  public async getAllMoneyReciept(payload: {
    hotel_id: number;
    from_date: string;
    to_date: string;
    limit: string;
    skip: string;
    key: string;
  }) {
    const { hotel_id, from_date, to_date, limit, skip, key } = payload;

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("money_receipt as mr");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "mr.id",
        "u.id as customer_id",
        "u.name as customer_name",
        "mr.money_receipt_no",
        "mr.payment_type",
        "mr.total_collected_amount",
        "ua.name as created_by_admin",
        "mr.created_at"
      )
      .leftJoin("user as u", "mr.user_id", "u.id")
      .leftJoin("user_admin as ua", "mr.created_by", "ua.id")
      .where("mr.hotel_id", hotel_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("mr.created_at", [from_date, endDate]);
        }
      })
      .andWhere(function () {
        if (key) {
          this.where("mr.money_receipt_no", "like", `%${key}%`).orWhere(
            "u.name",
            "like",
            `%${key}%`
          );
        }
      })
      .orderBy("mr.id", "desc");

    const total = await this.db("money_receipt as mr")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("mr.id as total")
      .leftJoin("user as u", "mr.user_id", "u.id")
      .where("mr.hotel_id", hotel_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("mr.created_at", [from_date, endDate]);
        }
      })
      .andWhere(function () {
        if (key) {
          this.where("mr.money_receipt_no", "like", `%${key}%`).orWhere(
            "u.name",
            "like",
            `%${key}%`
          );
        }
      });

    return { data, total: total[0].total };
  }

  // get single money reciept
  public async getSingleMoneyReciept(payload: {
    id: number;
    hotel_id: number;
  }) {
    const { hotel_id, id } = payload;

    return await this.db("money_receipt as mr")
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "mr.id",
        "u.id as customer_id",
        "u.name as customer_name",
        "mr.money_receipt_no",
        "mr.payment_type",
        "mr.total_collected_amount",
        "mr.remarks",
        "ua.name as created_by_admin",
        "mr.created_at"
      )
      .leftJoin("user as u", "mr.user_id", "u.id")
      .leftJoin("user_admin as ua", "mr.created_by", "ua.id")
      .where("mr.hotel_id", hotel_id)
      .andWhere("mr.id", id);
  }

  // insert return advance
  public async insertAdvanceReturn(payload: {
    hotel_id: number;
    money_reciept_id: number;
    return_date: string;
    remarks: string;
  }) {
    return await this.db("advance_return")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get all advance money reciept
  public async getAllAdvanceMoneyReciept(payload: {
    hotel_id: number;
    from_date: string;
    to_date: string;
    limit: string;
    skip: string;
    key: string;
  }) {
    const { hotel_id, from_date, to_date, limit, skip, key } = payload;

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("advance_return_view");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select("*")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("created_at", [from_date, endDate]);
        }
      })
      .andWhere(function () {
        if (key) {
          this.where("guest_name", "like", `%${key}%`);
        }
      })
      .orderBy("id", "desc");

    const total = await this.db("advance_return_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("id as total")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (from_date && to_date) {
          this.andWhereBetween("created_at", [from_date, endDate]);
        }
      })
      .andWhere(function () {
        if (key) {
          this.where("guest_name", "like", `%${key}%`);
        }
      })
      .orderBy("id", "desc");

    return { data, total: total[0].total };
  }

  // get single money reciept
  public async getSingleAdvanceMoneyReciept(hotel_id: number, id: number) {
    return await this.db("advance_return_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("*")
      .where({ hotel_id })
      .andWhere({ id });
  }
}

export default HotelInvoiceModel;
