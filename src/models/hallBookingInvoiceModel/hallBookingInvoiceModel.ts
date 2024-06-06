
import { IinsertHallBookingSubinvoiceItemPayload, IinsertHallBookingSubinvoicePayload, updateHallBookingSubinvoiceItemPayload, updateHallBookingSubinvoicePayload } from "../../appAdmin/utlis/interfaces/invoice.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class HallBookingInvoiceModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // Get all hall booking invoice
  public async getAllHallBookingInvoice(payload: {
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

  const dtbs = this.db("hall_booking_invoice_view");

  if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
  }
  const data = await dtbs
  .withSchema(this.RESERVATION_SCHEMA)
  .select(
    "id as invoice_id",
    "id as user_id",
    "hall_booking_id",
    "user_name",
    "invoice_no",
    "type",
    "discount_amount",
    "tax_amount",
    "sub_total",
    "grand_total",
    "due",
    "description",
    "created_at",
    "created_by_name"
  )
  .where("hotel_id", hotel_id)
  .andWhere(function () {
    if (key) {
      this.andWhere("invoice_no", "like", `%${key}%`).orWhere(
        "user_name",
        "like",
        `%${key}%`
      );
    }
  })
  .andWhere(function () {
    if (user_id) {
      this.andWhere("user_id", user_id);
    }
    if (from_date && to_date) {
      this.andWhereBetween("created_at", [from_date, endDate]);
    }
    if (due_inovice) {
      this.andWhere("due", ">", 0);
    }
  })
  .orderBy("id", "desc");

  const total = await this.db("hall_booking_invoice_view")
  .withSchema(this.RESERVATION_SCHEMA)
  .count("id as total")
  .where("hotel_id", hotel_id)
  .andWhere(function () {
    if (key) {
      this.andWhere("invoice_no", "like", `%${key}%`).orWhere(
        "user_name",
        "like",
        `%${key}%`
      );
    }
  })
  .andWhere(function () {
    if (user_id) {
      this.andWhere("user_id", user_id);
    }
    if (due_inovice) {
      this.andWhere("due", ">", 0);
    }
  });

    return { data, total: total[0].total };
  }

  // Get single hall booking invoice
  public async getSingleHallBookingInvoice(payload: {
    hotel_id: number;
    invoice_id: number;
    user_id?: number;
  }) {
  const { hotel_id, invoice_id, user_id } = payload;
  return await this.db("hall_booking_invoice_view")
    .withSchema(this.RESERVATION_SCHEMA)
    .select("*")
    .where({ hotel_id })
    .andWhere({ id: invoice_id })
    .andWhere(function () {
      if (user_id) {
        this.andWhere({ user_id });
      }
    });
  }

  //   insert room booking sub invoice
  public async insertHallBookingSubInvoice(
    payload: IinsertHallBookingSubinvoicePayload
  ) {
    return await this.db("hall_booking_sub_invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // insert hall booking sub invoice item
  public async insertHallBookingSubInvoiceItem(
    payload: IinsertHallBookingSubinvoiceItemPayload[]
  ) {
    return await this.db("hall_booking_sub_invoice_item")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // update room booking sub invoice
  public async updateHallBookingSubInvoice(
    payload: updateHallBookingSubinvoicePayload,
  ) {
    return await this.db("hall_booking_sub_invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload);
  }

  // update hall booking sub invoice item
  public async updateHallBookingSubInvoiceItem(
    payload: updateHallBookingSubinvoiceItemPayload[]
  ) {
    return await this.db("hall_booking_sub_invoice_item")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload);
  }

}
export default HallBookingInvoiceModel;
