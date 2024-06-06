import IguestInterface, {
  IuserPayload,
  IuserTypeInterface,
} from "../../appAdmin/utlis/interfaces/guest.interface";

import { IUpdateUser } from "../../appM360/utlis/interfaces/hotel-user.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class GuestModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // Create Guest
  public async createGuest(payload: IguestInterface) {
    return await this.db("user")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Create user_type
  public async createUserType(payload: IuserTypeInterface) {
    return await this.db("user_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get Guest user_type
  public async getGuest(payload: { user_type: string; email: string }) {
    const data = await this.db("user_view")
      .select("*")
      .withSchema(this.RESERVATION_SCHEMA)
      .orderBy("id", "desc");

    const total = await this.db("user_view")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("id as total");

    return { data, total: total[0].total };
  }

  // Get User Type
  public async getAllUserType() {
    return await this.db("user_type")
      .select("*")
      .withSchema(this.RESERVATION_SCHEMA);
  }

  // get exists user_type
  public async getExistsUserType(user_id: number, user_type: string) {
    return await this.db("user_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({
        user_id: user_id,
        user_type: user_type,
      })
      .first();
  }

  // get Guest email
  public async getAllGuestEmail(payload: { email: string; hotel_id: number }) {
    const { email, hotel_id } = payload;

    const dtbs = this.db("user");

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ "user.hotel_id": hotel_id })
      .andWhere({ "user.email": email })
      .orderBy("id", "desc");

    return { data };
  }

  // insert into guest ledger
  public async insertGuestLedger(payload: {
    name: string;
    user_id: number;
    hotel_id: number;
    pay_type: "debit" | "credit";
    amount: number;
    last_balance: number;
  }) {
    return await this.db("user_ledger")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get ledeger last balance by user
  public async getLedgerLastBalanceByUser(payload: {
    hotel_id: number;
    user_id: number;
  }) {
    const { hotel_id, user_id } = payload;
    const result = await this.db.raw(
      `SELECT ${this.RESERVATION_SCHEMA}.get_user_ledger_balance(?, ?) AS remaining_balance`,
      [user_id, hotel_id]
    );
    const remainingBalance = result[0][0].remaining_balance;
    return remainingBalance;
  }
  // Get All Guest Model
  public async getAllGuest(payload: {
    limit?: string;
    skip?: string;
    key?: string;
    user_type?: string;
    email: string;
    hotel_id: number;
  }) {
    const { key, hotel_id, limit, skip, user_type } = payload;

    const dtbs = this.db("user_view");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .select(
        "id",
        "name",
        "email",
        "country",
        "city",
        "status",
        "last_balance",
        "created_at",
        "user_type"
      )
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ hotel_id })
      .andWhere(function () {
        if (key) {
          this.andWhere("name", "like", `%${key}%`)
            .orWhere("email", "like", `%${key}%`)
            .orWhere("country", "like", `%${key}%`)
            .orWhere("city", "like", `%${key}%`);
        }

        if (user_type) {
          this.andWhereRaw(
            `JSON_CONTAINS(user_type, '[{"user_type": "${user_type}"}]')`
          );
        }
      })
      .orderBy("id", "desc");

    const total = await this.db("user_view")
      .withSchema(this.RESERVATION_SCHEMA)
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
          this.andWhereRaw(
            `JSON_CONTAINS(user_type, '[{"user_type": "${user_type}"}]')`
          );
        }
      });

    return { data, total: total[0].total };
  }

  // Get Guest single profile
  public async getSingleGuest(where: {
    email?: string;
    user_type?: string;
    id?: number;
    hotel_id?: number;
  }) {
    const { email, id, hotel_id } = where;
    return await this.db("user_view as uv")
      .select(
        "uv.id",
        "uv.name",
        "uv.email",
        "uv.country",
        "uv.city",
        "uv.status",
        "uv.last_balance",
        "uv.created_at",
        "uv.user_type"
      )
      .withSchema(this.RESERVATION_SCHEMA)
      .where(function () {
        if (id) {
          this.where("uv.id", id);
        }
        if (email) {
          this.where("uv.email", email);
        }
        if (hotel_id) {
          this.andWhere("uv.hotel_id", hotel_id);
        }
      });
  }

  //   update single guest
  public async updateSingleGuest(
    payload: { last_balance?: number },
    where: { hotel_id?: number; id?: number }
  ) {
    const { hotel_id, id } = where;
    return await this.db("user")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ hotel_id })
      .andWhere({ id });
  }

  //  update guest
  public async updateGuest(id: number, hotel_id: number, payload: IUpdateUser) {
    await this.db("user")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id, hotel_id })
      .update(payload);
  }

  // Get Hall Guest
  public async getHallGuest(payload: { hotel_id: number }) {
    const { hotel_id } = payload;

    const dtbs = this.db("user as u");

    const data = await dtbs
      .select("u.id", "u.name", "u.email", "u.last_balance")
      .withSchema(this.RESERVATION_SCHEMA)
      .distinct("u.id", "u.name", "u.email")
      .rightJoin("hall_booking as hb", "u.id", "hb.user_id")
      .where("u.hotel_id", hotel_id)
      .orderBy("u.id", "desc");

    const total = await this.db("user as u")
      .withSchema(this.RESERVATION_SCHEMA)
      .rightJoin("hall_booking as hb", "u.id", "hb.user_id")
      .countDistinct("u.id as total")
      .where("u.hotel_id", hotel_id);

    return { data, total: total[0].total };
  }

  // Get Room Guest
  public async getRoomGuest(payload: { hotel_id: number }) {
    const { hotel_id } = payload;

    const data = await this.db("user as u")
      .distinct("u.id", "u.name", "u.email", "u.last_balance")
      .withSchema(this.RESERVATION_SCHEMA)
      .rightJoin("room_booking as rb", "u.id", "rb.user_id")
      .where("u.hotel_id", hotel_id)
      .orderBy("u.id", "desc");

    const total = await this.db("user as u")
      .withSchema(this.RESERVATION_SCHEMA)
      .countDistinct("u.id as total")
      .rightJoin("room_booking as rb", "u.id", "rb.user_id")
      .where("u.hotel_id", hotel_id);

    return { data, total: total[0].total };
  }
}
export default GuestModel;
