import { x } from "joi";
import { IcreateEmployee, IupdateEmployee } from "../../appAdmin/utlis/interfaces/employee.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

class EmployeeModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // Create Employee
  public async insertEmployee(payload: IcreateEmployee) {
    return await this.db("employee")
      .withSchema(this.RESERVATION_SCHEMA)
      .insert(payload);
  }

  // Get All Employee Model
  public async getAllEmployee(payload: {
    limit?: string;
    skip?: string;
    key?: string;
    category?: string;
    hotel_id: number;
  }) {
  const { key, hotel_id, limit, skip, category } = payload;
  const dtbs = this.db("employee as e");
  if (limit && skip) {
    dtbs.limit(parseInt(limit as string));
    dtbs.offset(parseInt(skip as string));
  }

  const data = await dtbs
  .select(
    "e.id",
    "e.name",
    "e.email",
    'e.mobile_no',
    "d.name as department",
    "de.name as designation",
    "e.category",
    "e.salary",
    "e.joining_date",
    "e.status"
  )
  .withSchema(this.RESERVATION_SCHEMA)
  .leftJoin("department as d", "e.department_id", "d.id")
  .leftJoin("designation as de", "e.designation_id", "de.id")
  .where("e.hotel_id", hotel_id)
  .andWhere(function () {
    if (key) {
      this.andWhere("e.name", "like", `%${key}%`)
      .orWhere("e.email","like",`%${key}%`)
      .orWhere("d.name","like",`%${key}%`);
    }
    if (category) {
      this.andWhere("e.category", "like", `%${category}%`)
    }
  })
  .orderBy('e.id', 'desc');

  const total = await this.db("employee as e")
  .count("e.id as total")
  .withSchema(this.RESERVATION_SCHEMA)
  .leftJoin("department as d", "e.department_id", "d.id")
  .leftJoin("designation as de", "e.designation_id", "de.id")
  .where("e.hotel_id", hotel_id)
  .andWhere(function () {
    if (key) {
      this.andWhere("e.name", "like", `%${key}%`)
      .orWhere("e.email","like",`%${key}%`)
      .orWhere("d.name","like",`%${key}%`);
    }
    if (category) {
      this.andWhere("e.category", "like", `%${category}%`)
    }
  });

  return { data, total: total[0].total };
}

  // Get Single Employee
  public async getSingleEmployee( id: number,hotel_id: number,) {
  const data = await this.db("employee_view as ev")
  .withSchema(this.RESERVATION_SCHEMA)
  .select(
    'ev.id',
    'ev.name',
    'ev.photo',
    'ev.dep_id',
    'ev.dep_name as department',
    'ev.des_id',
    "ev.res_id",
    "ev.admin_id",
    "ev.res_name",
    'ev.des_name as designation',
    'ev.email',
    'ev.mobile_no',
    'ev.address',
    'ev.blood_group',
    'ev.salary',
    'ev.status',
    'ev.birth_date',
    "ev.category",
    'ev.appointment_date',
    'ev.joining_date',
    'ev.created_by',
    'ev.created_at',
    'ev.updated_at'
  )
  .where('ev.id', id)
  .andWhere('ev.hotel_id', hotel_id);

  return data.length > 0 ? data[0] : [];
  }

  // Update Employee
  public async updateEmployee(id: number, payload: IupdateEmployee) {
    return await this.db("employee")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .update(payload);
  }

  // Delete Employee
  public async deleteEmployee(id: number) {
    return await this.db("employee")
      .withSchema(this.RESERVATION_SCHEMA)
      .where({ id })
      .del();
  }

}
export default EmployeeModel;
