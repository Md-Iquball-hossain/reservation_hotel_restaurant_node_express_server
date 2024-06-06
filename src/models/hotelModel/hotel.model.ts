import {
  ICreateHotelUserPayload,
  IgetAllHotelUserPayload,
  IsingleHotelUserPayload,
  IupdateHotelUser,
} from "../../appM360/utlis/interfaces/mUserHotel.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class HotelModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // create hotel
  public async createHotel(payload: ICreateHotelUserPayload) {
    return await this.db("hotel")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get all hotel
  public async getAllHotel(payload: IgetAllHotelUserPayload) {
    const { from_date, to_date, name, status, limit, skip } = payload;

    const endDate = new Date(to_date as string);
    endDate.setDate(endDate.getDate() + 1);

    const dtbs = this.db("hotel");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "id",
        "name",
        "city",
        "email",
        "status",
        "group",
        "logo",
        "expiry_date",
        "created_at"
      )
      .where(function () {
        if (from_date && to_date) {
          this.andWhereBetween("created_at", [from_date, endDate]);
        }
        if (name) {
          this.andWhere("name", "like", `%${name}%`)
            .orWhere("group", "like", `%${name}%`)
            .orWhere("city", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere({ status });
        }
      })
      .orderBy("id", "desc");

    const total = await this.db("hotel")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("id AS total")
      .where(function () {
        if (from_date && to_date) {
          this.andWhereBetween("created_at", [from_date, to_date]);
        }
        if (name) {
          this.andWhere("name", "like", `%${name}%`)
            .orWhere("group", "like", `%${name}%`)
            .orWhere("city", "like", `%${name}%`);
        }
        if (status) {
          this.andWhere({ status });
        }
      });

    return {
      data,
      total: total[0].total,
    };
  }

  // get single hotel
  public async getSingleHotel(payload: IsingleHotelUserPayload) {
    const { id, email } = payload;
    return await this.db("hotel_view")
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
  }

  // update hotel
  public async updateHotel(
    payload: IupdateHotelUser,
    where: { id?: number; email?: string }
  ) {
    const { email, id } = where;
    return await this.db("hotel")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where(function () {
        if (id) {
          this.where({ id });
        } else if (email) {
          this.where({ email });
        }
      });
  }

  // insert hotel images
  public async insertHotelImage(
    payload: { photo: string; hotel_id: number }[]
  ) {
    return await this.db("hotel_images")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // delete hotel images
  public async deleteHotelImage(payload: [], hotel_id: number) {
    return await this.db("hotel_images")
      .withSchema(this.RESERVATION_SCHEMA)
      .delete()
      .whereIn("id", payload)
      .andWhere("hotel_id", hotel_id);
  }

  // insert hotel amnities
  public async insertHotelAmnities(
    payload: { name: string; hotel_id: number }[]
  ) {
    return await this.db("hotel_aminities")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // delete hotel amnities
  public async deleteHotelAmnities(payload: [], hotel_id: number) {
    return await this.db("hotel_aminities")
      .withSchema(this.RESERVATION_SCHEMA)
      .delete()
      .whereIn("id", payload)
      .andWhere("hotel_id", hotel_id);
  }
}

export default HotelModel;
