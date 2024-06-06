import { ICreateAdditionBody, ICreatePayrollBody,  ICreatedeductionBody} from "../../appAdmin/utlis/interfaces/payRoll.interface";
import { TDB } from "../../common/types/commontypes";
import Schema from "../../utils/miscellaneous/schema";

    class PayRollModel extends Schema {
        private db: TDB;

        constructor(db: TDB) {
            super();
            this.db = db;
        }

    // Create PayRoll
    public async CreatePayRoll(payload: ICreatePayrollBody) {
        return await this.db("payroll")
            .withSchema(this.RESERVATION_SCHEMA)
            .insert(payload);
    }

    // Create pay roll deductions
    public async createPayRoll_deductions(insertObj: ICreatedeductionBody[]) {
    const res = await this.db("payroll_deductions")
        .withSchema(this.RESERVATION_SCHEMA)
        .insert(insertObj);
        return res;
    }

    // Create pay roll additions
    public async createPayRoll_additions(insertObj: ICreateAdditionBody[]) {
        const res = await this.db("payroll_additions")
            .withSchema(this.RESERVATION_SCHEMA)
            .insert(insertObj);
            return res;
        }

    // Get All Pay Roll
    public async getAllPayRoll(payload: {
        from_date: string;
        to_date: string;
        limit?: string;
        skip?: string;
        key?: string;

        hotel_id: number;
    }) {
    const { key, hotel_id, limit, skip, from_date, to_date } = payload;
    const dtbs = this.db("payroll as p");

    const endDatePlusOneDay = new Date(to_date);
    endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);

    if (limit && skip) {
        dtbs.limit(parseInt(limit as string));
        dtbs.offset(parseInt(skip as string));
    }

        const data = await dtbs
        .select(
        "p.id",
        "p.voucher_no",
        "e.name as employee_name",
        "de.name as designation",
        "a.ac_type as pay_method",
        "a.name as account_name",
        "e.salary as base_salary",
        "p.attendance_days",
        "p.working_hours",
        "p.gross_salary",
        "p.total_salary",
        "p.salary_date"
    )
    .withSchema(this.RESERVATION_SCHEMA)
    .leftJoin("employee as e", "e.id", "p.employee_id")
    .leftJoin("designation as de","de.id", "e.designation_id" )
    .leftJoin("account as a","a.id", "p.ac_tr_ac_id")
    .where("p.hotel_id", hotel_id)
    .andWhere(function () {
        if (from_date && to_date) {
            this.andWhereBetween("p.salary_date", [from_date, to_date]);
        }
        if (key) {
        this.andWhere("e.name", "like", `%${key}%`)
        .orWhere("de.name","like",`%${key}%`)
        .orWhere("p.voucher_no","like",`%${key}%`)
        .orWhere("a.name","like",`%${key}%`)
        }
    })
    .orderBy('p.id', 'desc');

    const total = await this.db("payroll as p")
    .count("p.id as total")
    .withSchema(this.RESERVATION_SCHEMA)
    .leftJoin("employee as e", "e.id", "p.employee_id")
    .leftJoin("designation as de","de.id", "e.designation_id" )
    .leftJoin("account as a","a.id", "p.ac_tr_ac_id")
    .where("p.hotel_id", hotel_id)
    .andWhere(function () {
        if (from_date && to_date) {
            this.andWhereBetween("p.salary_date", [from_date, to_date]);
        }
        if (key) {
            this.andWhere("e.name", "like", `%${key}%`)
            .orWhere("de.name","like",`%${key}%`)
            .orWhere("p.voucher_no","like",`%${key}%`)
            .orWhere("a.name","like",`%${key}%`)
            }
    });

    return { data, total: total[0].total };
    }

    // get all voucher last id
    public async getAllIVoucherForLastId() {
        return await this.db("payroll")
        .select("id")
        .withSchema(this.RESERVATION_SCHEMA)
        .orderBy("id", "desc")
        .limit(1);
    }

    // get single pay Roll 
    public async getSinglePayRoll(id: number, hotel_id: number) {
        return await this.db("payroll_view")
        .withSchema(this.RESERVATION_SCHEMA)
        .select("*")
        .where({ id })
        .andWhere({ hotel_id });
    }

}
export default PayRollModel;
