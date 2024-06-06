export interface ICreateExpenseHeadPayload {
  res_id?: number;
  hotel_id: number;
  name: string;
}

export interface IUpdateExpenseHeadPayload {
  hotel_id: number;
  name: string;
}

export interface ICreateExpensebody {
  hotel_id: number;
  name: string;
  ac_tr_ac_id: number;
  remarks: string;
  expense_date?: Date;
  voucher_no: string;
  expense_item: any[];
}

export interface ICreateExpensePayload {
  hotel_id: number;
  name: string;
  ac_tr_ac_id: number;
  remarks: string;
  expense_date?: Date;
  voucher_no: string;
  created_by: number;
  total: number;
}