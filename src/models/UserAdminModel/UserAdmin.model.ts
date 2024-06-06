import {
  ICreateUserAdminPayload,
  IUpdateAdminUserPayload,
} from "../../appM360/utlis/interfaces/mUserAdmin.interfaces";
import { TDB } from "../../common/types/commontypes";

import Schema from "../../utils/miscellaneous/schema";

class RUserAdminModel extends Schema {
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

  // get admin by email
  public async getAdminByEmail(email: string) {
    return await this.db("user_admin AS ua")
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "ua.id",
        "ua.email",
        "ua.password",
        "ua.name",
        "ua.avatar",
        "ua.phone",
        "ua.status",
        "r.id As roleId",
        "r.name As roleName",
        "ua.created_at"
      )
      .leftJoin("role AS r", "ua.role", "r.id")
      .where({ email });
  }

  // get admin by id
  public async getAdminById(id: number) {
    return await this.db("user_admin AS ua")
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "ua.id",
        "ua.email",
        "ua.password",
        "ua.name",
        "ua.avatar",
        "ua.phone",
        "ua.status",
        "r.id As roleId",
        "r.name As roleName",
        "ua.created_at"
      )
      .leftJoin("role AS r", "ua.role", "r.id")
      .where("ua.id", id);
  }

  // get all admin
  public async getAllAdmin(limit: string, skip: string, status: string) {
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
        "r.id As roleId",
        "r.name As roleName",
        "ua.created_at"
      )
      .leftJoin("role AS r", "ua.role", "r.id")
      .where(function () {
        if (status) {
          this.where({ status });
        }
      });

    const total = await this.db("user_admin AS ua")
      .count("ua.id As total")
      .withSchema(this.RESERVATION_SCHEMA)
      .leftJoin("role AS r", "ua.role", "r.id")
      .where(function () {
        if (status) {
          this.where({ status });
        }
      });

    return { data, total: total[0].total };
  }

  // update admin model
  public async updateAdmin(
    payload: IUpdateAdminUserPayload,
    where: { email: string }
  ) {
    return await this.db("user_admin")
      .withSchema(this.RESERVATION_SCHEMA)
      .update(payload)
      .where({ email: where.email });
  }
}
export default RUserAdminModel;
