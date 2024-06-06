export interface ICreateTablePayload {
  res_id: number;
  name: string;
  category: string;
  created_by: number;
}

export interface ICreateSubTablePayload {
  res_id: number;
  name: string;
  created_by: number;
}

// postpaid
export interface ICreateOrderBody {
  res_id: number;
  user_id?: number;
  order_no: string;
  token_no: string;
  staff_id: number;
  is_paid?: number;
  grand_total: number;
  sub_total: number;
  include_with_hotel?: number;
  status: "confirmed" | "canceled" | "finished";
  kitchen_status: string;
  order_category: string;
  order_type: string;
  created_by: number;
  note: string;
}

export interface IupdateOrderBody {
  user_id?: number;
  emp_id?: number;
  updated_by?: number;
  sub_total?: number;
  discount?: number;
  include_with_hotel?: number;
  grand_total?: number;
  vat?: number;
  is_paid?: number;
  status?: string;
  ac_tr_ac_id?: number;
  payable_amount?: number;
  changeable_amount?: number;
}

export interface IUpdateOrderItemsPayload {
  res_id: number;
  food_id: number;
  name: string;
  quantity: number;
  rate: number;
  total: number;
  updated_by: number;
}

// prepaid
export interface ICreatePrePaidOrderBody {
  res_id: number;
  tab_id: number;
  user_id: number;
  order_no: string;
  token_no: string;
  emp_id: number;
  status: string;
  ac_tr_ac_id: number;
  sub_total: number;
  discount: number;
  grand_total: number;
  vat: number;
  payable_amount: number;
  change_amount: number;
  kitchen_status: string;
  order_category: string;
  order_type: string;
  created_by: number;
  note: string;
}

export interface ICreateOrderItemsPayload {
  food_id: number;
  name: string;
  order_id: number;
  quantity: number;
  rate: number;
  total: number;
}

export interface IUpdateKitchenStatusPayload {
  kitchen_status: string;
}

export interface IUpdateTableStatus {
  status: string;
  name?: string;
}

export interface IUpdateTableName {
  status: string;
  name: string;
}

export interface IUpdateOrderStatus {
  status: string;
  updated_by: number;
  check_out: string;
}

export interface IUpdatePayStatusPayload {
  pay_status: string;
}
