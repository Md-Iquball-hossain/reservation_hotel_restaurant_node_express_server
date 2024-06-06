export interface ICreatePayrollBody {
    hotel_id: number;
    voucher_no?: number;
    employee_id: number;
    attendance_days: number;
    working_hours: number;
    ac_tr_ac_id: number;
    gross_salary: number;
    advance_salary: number | null;
    provident_fund: number | null;
    mobile_bill: number | null;
    feed_allowance: number | null;
    perform_bonus: number | null;
    festival_bonus: string | null;
    travel_allowance: string | null;
    health_allowance: string | null;
    incentive: string | null;
    house_rent: string | null;
    salary_date: string;
    total_salary: number;
    docs: string | null;
    note: string | null;
}

export interface ICreatedeductionBody {
    payroll_id: number;
    deduction_amount: number;
    deduction_reason: string;
}

export interface ICreateAdditionBody {
    payroll_id: number;
    hours: number;
    other_amount: number;
    other_details: string;
}
