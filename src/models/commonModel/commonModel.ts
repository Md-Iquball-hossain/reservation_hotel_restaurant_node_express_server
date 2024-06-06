/*
DB Query for common OTP
@Author Shidul Islam <shidul.m360ict@gmail.com>
*/

import {
  IGetOTPPayload,
  IInsertOTPPayload,
} from "../../common/interfaces/commonInterface";
import {
  IUpdateChangePassModelProps,
  IVerifyModelPassProps,
  TDB,
} from "../../common/types/commontypes";

import Schema from "../../utils/miscellaneous/schema";
class CommonModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // insert OTP
  public async insertOTP(payload: IInsertOTPPayload) {
    return await this.db("email_otp")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .insert(payload);
  }

  // get otp
  public async getOTP(payload: IGetOTPPayload) {
    const check = await this.db("email_otp")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .select("id", "hashed_otp", "tried")
      .andWhere("email", payload.email)
      .andWhere("type", payload.type)
      .andWhere("matched", 0)
      .andWhere("tried", "<", 3)
      .andWhereRaw("ADDTIME(created_at, '0:3:0') > NOW()");

    return check;
  }

  // update otp
  public async updateOTP(
    payload: { tried: number; matched?: number },
    where: { id: number }
  ) {
    return await this.db("email_otp")
      .withSchema(this.M_RESERVATION_SCHEMA)
      .update(payload)
      .where(where);
  }

  // user password verify
  public async getUserPassword({
    table,
    schema,
    passField,
    userIdField,
    userId,
  }: IVerifyModelPassProps) {
    return await this.db(table)
      .withSchema(schema)
      .select(passField)
      .where(userIdField, userId);
  }

  // update password
  public async updatePassword({
    table,
    userIdField,
    userId,
    passField,
    schema,
    hashedPass,
  }: IUpdateChangePassModelProps) {
    return await this.db(table)
      .update(passField, hashedPass)
      .withSchema(schema)
      .where(userIdField, userId);
  }

  // insert audit trail
  // public async insetAuditTrail(payload: IInsertAuditTrailPayload) {
  //   return await this.db("auditTrail")
  //     .withSchema(this.ADMINISTRATION_SCHEMA)
  //     .insert(payload);
  // }

  // create division
  // public async createDivision(payload: ICreateDivisionPayload) {
  //   return await this.db("division")
  //     .withSchema(this.DBO_SCHEMA)
  //     .insert(payload);
  // }

  // get division
  // public async getDivision() {
  //   try {
  //     return await this.db("division").withSchema(this.DBO_SCHEMA).select("*");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // get district
  // public async getDistrict(filter: IGetDistrictParams) {
  //   return await this.db("district")
  //     .withSchema(this.DBO_SCHEMA)
  //     .select("*")
  //     .where(filter);
  // }

  // get thana
  // public async getThana(filter: IGetThanaParams) {
  //   return await this.db("thana AS t")
  //     .withSchema(this.DBO_SCHEMA)
  //     .select("t.id", "t.name")
  //     .join("district AS d", "t.districtId", "d.id")
  //     .where((qb) => {
  //       if (filter.districtId) {
  //         qb.andWhere("t.districtId", filter.districtId);
  //       }
  //       if (filter.divisionId) {
  //         qb.andWhere("d.divisionId", filter.divisionId);
  //       }
  //     });
  // }

  // get area
  // public async getArea(filter: IGetAreaParams) {
  //   return await this.db("addressView")
  //     .withSchema(this.DBO_SCHEMA)
  //     .select("areaId AS id", "areaName AS name")
  //     .where(filter);
  // }
}
export default CommonModel;

/*
DB Query for common OTP Last update
@Author Mahmudul islam Moon <moon.m360ict@gmail.com>
*/
