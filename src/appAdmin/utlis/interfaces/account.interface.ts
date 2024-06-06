export interface IAccountCreateBody {
  name: string;
  hotel_id: number;
  bank?: string;
  branch?: string;
  account_number?: string;
  opening_balance?: number;
  created_by?: number;
  details?: string;
}

export interface IinsertTransaction {
  ac_tr_ac_id: number;
  ac_tr_cash_in?: number;
  ac_tr_cash_out?: number;
}

export interface IinsertLedger {
  ac_tr_id: number;
  ledger_debit_amount?: number;
  ledger_credit_amount?: number;
  ledger_balance: number;
  ledger_details: string;
}

export interface IinsertSupplierLedger {
  res_id: number;
  ac_tr_ac_id: number;
  ac_tr_id: number;
  supplier_id: number;
  ledger_debit_amount?: number;
  ledger_credit_amount?: number;
  ledger_details: string;
}

export interface IupdateAccount {
  name?: string;
  bank?: string;
  branch?: string;
  account_number?: string;
  details?: string;
  last_balance?: number;
}
