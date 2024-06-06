export interface IinsertinvoicePayload {
  invoice_no: string;
  hotel_id: number;
  user_id?: number;
  discount_amount: number;
  tax_amount?: number;
  sub_total: number;
  grand_total: number;
  due: number;
  description: string;
  type: "online_site" | "front_desk";
  created_by: number;
}

export interface IinsertinvoiceItemPayload {
  invoice_id: number;
  name?: string;
  discount?: number;
  total_price: number;
  quantity: number;
}

export interface IinvoiceItemPayload {
  name: string;
  total_price: number;
  quantity: number;
}

export interface IcreateInvoicePayload {
  user_id: number;
  discount_amount: number;
  tax_amount: number;
  invoice_item: IinvoiceItemPayload[];
}

export interface IcreateMoneyReciept {
  hotel_id: number;
  user_id: number;
  money_receipt_no: string;
  description: string;
  voucher_no?: string;
  total_collected_amount: number;
  created_by: number;
  payment_type: "bank" | "cash" | "cheque" | "mobile-banking";
  remarks: string;
  return_date?: string;
  ac_tr_id?: number;
}

export interface IinsertMoneyRecieptItem {
  money_reciept_id: number;
  invoice_id: number;
  paid?: number;
}

export interface IinsertRoomBookinginvoicePayload {
  invoice_no: string;
  hotel_id: number;
  room_booking_id: number;
  user_id: number;
  discount_amount: number;
  tax_amount?: number;
  sub_total: number;
  grand_total: number;
  due: number;
  description: string;
  type: "online_site" | "front_desk";
  created_by: number;
}

export interface IinsertRoomBookingSubinvoicePayload {
  inv_id: number;
  room_booking_id: number;
}

export interface IinsertRoomBookingSubinvoiceItemPayload {
  sub_inv_id: number;
  room_id: number;
  name: string;
  total_price: number;
  quantity?: number;
}

export interface updateRoomBookingSubinvoicePayload {
  inv_id: number;
  room_booking_id: number;
}

export interface updateRoomBookingSubinvoiceItemPayload {
  sub_inv_id: number;
  room_id: number;
  name: string;
  total_price: number;
  quantity?: number;
}

export interface IinsertHallBookingSubinvoicePayload {
  inv_id: number;
  hall_booking_id: number;
}

export interface IinsertHallBookingSubinvoiceItemPayload {
  sub_inv_id: number;
  hall_id: number;
  name: string;
  total_price: number;
  quantity?: number;
}

export interface updateHallBookingSubinvoicePayload {
  inv_id: number;
  hall_booking_id: number;
}

export interface updateHallBookingSubinvoiceItemPayload {
  sub_inv_id: number;
  hall_id: number;
  name: string;
  total_price: number;
  quantity?: number;
}

export interface updateSingleInvoice {
  discount_amount: number;
  tax_amount : number;
  sub_total : number;
  grand_total : number;
  due : number;
}



