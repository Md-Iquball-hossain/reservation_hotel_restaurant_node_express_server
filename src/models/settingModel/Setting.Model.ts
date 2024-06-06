import {
  ICreateBankNamePayload,
  ICreateBedTypePayload,
  ICreateHallAmenitiesPayload,
  ICreatePayrollMonths,
  ICreateRoomAmenitiesPayload,
  ICreateRoomTypePayload,
  ICreatedepartment,
  ICreatedesignation,
  IUpdateBankName,
  IUpdateBedTypePayload,
  IUpdateHallAmenitiesPayload,
  IUpdatePayrollMonths,
  IUpdateRoomAmenitiesPayload,
  IUpdateRoomTypePayload,
  IUpdatedepartment,
  IUpdatedesignation,
} from "../../appAdmin/utlis/interfaces/setting.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class SettingModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //=================== Room Type  ======================//

  // create room type
  public async createRoomType(payload: ICreateRoomTypePayload) {
    return await this.db("hotel_room_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All room type
  public async getAllRoomType(payload: {
    limit?: string;
    skip?: string;
    room_type: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, room_type } = payload;

    const dtbs = this.db("hotel_room_type as hrt");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string, 10));
      dtbs.offset(parseInt(skip as string, 10));
    }

    const dataQuery = dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select("hrt.id", "hrt.room_type")
      .where("hrt.hotel_id", hotel_id);

    if (room_type) {
      dataQuery.andWhere("hrt.room_type", "like", `%${room_type}%`);
    }

    const data = await dataQuery.orderBy("hrt.id", "desc");

    const totalQuery = this.db("hotel_room_type as hrt")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("hrt.id as total")
      .where("hrt.hotel_id", hotel_id);

    if (room_type) {
      totalQuery.andWhere("hrt.room_type", "like", `%${room_type}%`);
    }

    const total = await totalQuery;

    return { total: total[0].total, data };
  }

  // Update room type
  public async updateRoomType(id: number, payload: IUpdateRoomTypePayload) {
    const { room_type: newRoomType } = payload;

    await this.db("hotel_room")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ room_type: newRoomType })
      .update({ room_type: newRoomType });

      return await this.db("hotel_room_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);

  }

  // Delete Room Type
  public async deleteRoomType(id: number) {
    return await this.db("hotel_room_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== Bed Type  ======================//

  // create bed type
  public async createBedType(payload: ICreateBedTypePayload) {
    return await this.db("hotel_room_bed_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All bed type
  public async getAllBedType(payload: {
    limit?: string;
    skip?: string;
    bed_type: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, bed_type } = payload;

    const dtbs = this.db("hotel_room_bed_type as hrbt");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select("hrbt.id", "hrbt.bed_type")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (bed_type) {
          this.andWhere("hrbt.bed_type", "like", `%${bed_type}%`);
        }
      })
      .orderBy("hrbt.id", "desc");

    const total = await this.db("hotel_room_bed_type as hrbt")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("hrbt.id as total")
      .where("hrbt.hotel_id", hotel_id)
      .andWhere(function () {
        if (bed_type) {
          this.andWhere("hrbt.bed_type", "like", `%${bed_type}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Bed Type
  public async updateBedType(id: number, payload: IUpdateBedTypePayload) {
    const { bed_type: newRoomType } = payload;

    await this.db("hotel_room")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update({ bed_type: newRoomType });

    return this.db("hotel_room_bed_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);
  }

  // Delete Bed Type
  public async deleteBedType(id: number) {
    return await this.db("hotel_room_bed_type")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== Room Amenities  ======================//

  // create Room Amenities
  public async createRoomAmenities(payload: ICreateRoomAmenitiesPayload) {
    return await this.db("hotel_room_amenities_head")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All Room Amenities
  public async getAllRoomAmenities(payload: {
    limit?: string;
    skip?: string;
    room_amenities: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, room_amenities } = payload;

    const dtbs = this.db("hotel_room_amenities_head as hrah");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select("hrah.id", "hrah.room_amenities")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (room_amenities) {
          this.andWhere("hrah.room_amenities", "like", `%${room_amenities}%`);
        }
      })
      .orderBy("hrah.id", "desc");

    const total = await this.db("hotel_room_amenities_head as hrah")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("hrah.id as total")
      .where("hrah.hotel_id", hotel_id)
      .andWhere(function () {
        if (room_amenities) {
          this.andWhere("hrah.room_amenities", "like", `%${room_amenities}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Room Amenities
  public async updateRoomAmenities(
    id: number,
    payload: IUpdateRoomAmenitiesPayload
  ) {
    return await this.db("hotel_room_amenities_head")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);

  }

  // Delete Room Amenities
  public async deleteRoomAmenities(id: number) {
    return await this.db("hotel_room_amenities_head")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== Bank Name  ======================//

  // create Bank Name
  public async createBankName(payload: ICreateBankNamePayload) {
    return await this.db("bank_name")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All Bank Name
  public async getAllBankName(payload: {
    limit?: string;
    skip?: string;
    name: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, name } = payload;

    const dtbs = this.db("bank_name as bn");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select("bn.id", "bn.name as bank_name")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("bn.name", "like", `%${name}%`);
        }
      })
      .orderBy("bn.id", "desc");

    const total = await this.db("bank_name as bn")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("bn.id as total")
      .where("bn.hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("bn.name", "like", `%${name}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Bank Name
  public async updateBankName(
    id: number,
    payload: IUpdateBankName
  ) {
    return await this.db("bank_name")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);
  }

  // Delete Bank Name
  public async deleteBankName(id: number) {
    return await this.db("bank_name")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== Designation Model  ======================//

  // create  Designation Model 
  public async createDesignation (payload: ICreatedesignation) {
    return await this.db("designation")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All designation
  public async getAllDesignation(payload: {
    limit?: string;
    skip?: string;
    name: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, name } = payload;

    const dtbs = this.db("designation as d");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "d.id", 
        "d.name as designation_name")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("d.name", "like", `%${name}%`);
        }
      })
      .orderBy("d.id", "desc");

    const total = await this.db("designation as d")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("d.id as total")
      .where("d.hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("d.name", "like", `%${name}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Designation
  public async updateDesignation(
    id: number,
    payload: IUpdatedesignation
  ) {
    return await this.db("designation")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);

  }

  // Delete designation
  public async deleteDesignation(id: number) {
    return await this.db("designation")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

  //=================== Department Model  ======================//

  // create Department 
  public async createDepartment (payload: ICreatedepartment) {
    return await this.db("department")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All Department
  public async getAllDepartment(payload: {
    limit?: string;
    skip?: string;
    name: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, name } = payload;

    const dtbs = this.db("department as d");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "d.id", 
        "d.name as department_name")
      .where("hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("d.name", "like", `%${name}%`);
        }
      })
      .orderBy("d.id", "desc");

    const total = await this.db("department as d")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("d.id as total")
      .where("d.hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("d.name", "like", `%${name}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Department
  public async updateDepartment(
    id: number,
    payload: IUpdatedepartment
  ) {
    return await this.db("department")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);

  }

  // Delete Department
  public async deleteDepartment(id: number) {
    return await this.db("department")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

   //=================== Hall Amenities  ======================//

  // create Hall Amenities
  public async createHallAmenities(payload: ICreateHallAmenitiesPayload) {
    return await this.db("hall_amenities")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All Hall Amenities
  public async getAllHallAmenities(payload: {
    limit?: string;
    skip?: string;
    name: string;
    description?: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, name } = payload;

    const dtbs = this.db("hall_amenities as ha");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "ha.id", 
        "ha.name",
        "ha.description"
        )
      .where("ha.hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("ha.name", "like", `%${name}%`);
        }
      })
      .orderBy("ha.id", "desc");

    const total = await this.db("hall_amenities as ha")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("ha.id as total")
      .where("ha.hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("ha.name", "like", `%${name}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Hall Amenities
  public async updateHallAmenities(
    id: number,
    payload: IUpdateHallAmenitiesPayload
  ) {
    return await this.db("hall_amenities")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);

  }

  // Delete Hall Amenities
  public async deleteHallAmenities(id: number) {
    return await this.db("hall_amenities")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

    //=================== Payroll Months ======================//

  // create  Payroll Months 
  public async createPayrollMonths (payload: ICreatePayrollMonths) {
    return await this.db("payroll_months")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All PayrollMonths
  public async getPayrollMonths(payload: {
    limit?: string;
    skip?: string;
    name: string;
    hotel_id: number;
  }) {
    const { limit, skip, hotel_id, name } = payload;

    const dtbs = this.db("payroll_months as pm");

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.RESERVATION_SCHEMA)
      .select(
        "pm.id", 
        "pm.name as month_name",
        "pm.days as working_days",
        "pm.hours"
        )
      .where("pm.hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("pm.name", "like", `%${name}%`);
        }
      })
      .orderBy("pm.id", "asc");

    const total = await this.db("payroll_months as pm")
      .withSchema(this.RESERVATION_SCHEMA)
      .count("pm.id as total")
      .where("pm.hotel_id", hotel_id)
      .andWhere(function () {
        if (name) {
          this.andWhere("pm.name", "like", `%${name}%`);
        }
      });

    return { total: total[0].total, data };
  }

  // Update Payroll Months
  public async updatePayrollMonths(
    id: number,
    payload: IUpdatePayrollMonths
  ) {
    return await this.db("payroll_months")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);
  }

  // Delete Payroll Months
  public async deletePayrollMonths(id: number) {
    return await this.db("payroll_months")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

}
export default SettingModel;
