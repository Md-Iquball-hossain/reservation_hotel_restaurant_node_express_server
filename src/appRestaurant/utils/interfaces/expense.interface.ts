export interface ICreateResExpensebody {
  name: string;
  ac_tr_ac_id: number;
  remarks: string;
  expense_date: string;
  expense_category: string;
  expense_item: any[];
}

export interface ICreateResExpensePayload {
  res_id: number;
  name: string;
  ac_tr_ac_id: number;
  remarks: string;
  expense_date: string;
  voucher_no: string;
  created_by: number;
  expense_category?: string;
  total: number;
}

export interface ICreateResExpenseHeadPayload {
  res_id: number;
  name: string;
}

export interface IUpdateResExpenseHeadPayload {
  res_id: number;
  name: string;
}

export interface ICreateExpenseItemsPayload {
  name: string;
  expense_id: number;
  amount: number;
}
