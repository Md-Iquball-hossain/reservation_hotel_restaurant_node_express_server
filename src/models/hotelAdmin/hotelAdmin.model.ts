import {
  ICreateUserAdminPayload,
  IUpdateAdminPayload,
} from "../../auth/utils/interfaces/hotel-admin.auth.types";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class HotelAdminModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // insert user admin
  public async insertUserAdmin(payload: ICreateUserAdminPayload) {
    return await this.db("user_admin")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  public async getSingleAdmin(where: { email?: string; id?: number }) {
    const { email, id } = where;
    return await this.db("user_admin AS ua")
      .select(
        "ua.hotel_id",
        "ua.id",
        "ua.email",
        "ua.password",
        "ua.name",
        "ua.avatar",
        "ua.phone",
        "ua.status",
        "r.id As role_id",
        "r.name As role_name",
        "ua.created_at"
      )
      .withSchema(this.RESERVATION_SCHEMA)
      .leftJoin("role AS r", "ua.hotel_id", "r.hotel_id")
      .where(function () {
        if (id) {
          this.where("ua.id", id);
        }
        if (email) {
          this.where("ua.email", email);
        }
      });
  }

  // get all admin
  public async getAllAdmin(payload: {
    hotel_id: number;
    limit: string;
    skip: string;
    status?: string;
  }) {
    const { limit, skip, status, hotel_id } = payload;
    const dtbs = this.db("user_admin AS ua");
    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "ua.id",
        "ua.email",
        "ua.name",
        "ua.avatar",
        "ua.phone",
        "ua.status",
        "r.id As role_id",
        "r.name As role_name",
        "ua.created_at"
      )
      .leftJoin("role AS r", "ua.role", "r.id")
      .where(function () {
        if (status) {
          this.where("ua.status", status);
        }
        this.andWhere("ua.hotel_id", hotel_id);
      });

    const total = await this.db("user_admin AS ua")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("ua.id As total")
      .leftJoin("role AS r", "ua.role", "r.id")
      .where(function () {
        if (status) {
          this.where("ua.status", status);
        }
        this.andWhere("ua.hotel_id", hotel_id);
      });

    return { data, total: total[0].total };
  }

  // update admin model
  public async updateAdmin(
    payload: IUpdateAdminPayload,
    where: { email: string }
  ) {
    return await this.db("user_admin")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ email: where.email });
  }
}
export default HotelAdminModel;
