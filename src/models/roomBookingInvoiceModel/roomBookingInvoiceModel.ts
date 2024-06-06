import {
  IinsertRoomBookingSubinvoiceItemPayload,
  IinsertRoomBookingSubinvoicePayload,
  IinsertRoomBookinginvoicePayload,
  updateRoomBookingSubinvoiceItemPayload,
  updateRoomBookingSubinvoicePayload,
} from "../../appAdmin/utlis/interfaces/invoice.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class RoomBookingInvoiceModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // Get all room booking invoice
  public async getAllRoomBookingInvoice(payload: {
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

    const dtbs = this.db("room_booking_invoice_view");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }
    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "id as invoice_id",
        "user_id",
        "room_booking_id",
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

    const total = await this.db("room_booking_invoice_view")
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

  // Get single room booking invoice
  public async getSingleRoomBookingInvoice(payload: {
    hotel_id: number;
    invoice_id?: number;
    room_booking_id?: number;
    user_id?: number;
  }) {
    const { hotel_id, invoice_id, user_id, room_booking_id } = payload;
    return await this.db("room_booking_invoice_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .select("*")
      .where({ hotel_id })
      .andWhere(function () {
        if (user_id) {
          this.andWhere({ user_id });
        }
        if (invoice_id) {
          this.andWhere({ id: invoice_id });
        }
        if (room_booking_id) {
          this.andWhere({ room_booking_id });
        }
      });
  }

  // get all room booking invoice for last id
  public async getAllRoomBookingInvoiceForLastId() {
    return await this.db("room_booking_invoice")
      .select("id")
      .withSchema(this.RESERVATION_SCHEMA)
      .orderBy("id", "desc")
      .limit(1);
  }

  //   insert room booking invoice
  public async insertRoomBookingInvoice(
    payload: IinsertRoomBookinginvoicePayload
  ) {
    return await this.db("room_booking_invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  //   insert room booking sub invoice
  public async insertRoomBookingSubInvoice(
    payload: IinsertRoomBookingSubinvoicePayload
  ) {
    return await this.db("room_booking_sub_invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  //   insert room booking sub invoice item
  public async insertRoomBookingSubInvoiceItem(
    payload: IinsertRoomBookingSubinvoiceItemPayload[]
  ) {
    return await this.db("room_booking_sub_invoice_item")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // update room booking sub invoice
  public async updateRoomBookingSubInvoice(
    payload: updateRoomBookingSubinvoicePayload
  ) {
    return await this.db("room_booking_sub_invoice")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload);
  }

  //  update room booking sub invoice item
  public async updateRoomBookingSubInvoiceItem(
    payload: updateRoomBookingSubinvoiceItemPayload[]
  ) {
    return await this.db("room_booking_sub_invoice_item")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload);
  }
}
export default RoomBookingInvoiceModel;
