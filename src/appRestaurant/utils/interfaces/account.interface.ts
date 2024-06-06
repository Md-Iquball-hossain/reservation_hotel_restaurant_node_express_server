export interface IAccountResCreateBody {
    name: string;
    res_id: number;
    bank?: string;
    branch?: string;
    account_number?: string;
    opening_balance?: number;
    created_by?: number;
    details?: string;
    }

    export interface IinsertResTransaction {
    res_id: number;
    ac_tr_ac_id: number;
    ac_tr_cash_in?: number;
    ac_tr_cash_out?: number;
    }