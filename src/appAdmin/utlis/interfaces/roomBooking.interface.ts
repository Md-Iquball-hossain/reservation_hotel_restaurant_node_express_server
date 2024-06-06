export interface IRoomBooking {
  hotel_id: number;
  user_id: number;
  created_by?: number;
  check_in_time: string;
  check_out_time: string;
  number_of_nights: number;
  total_occupancy: number;
  pay_status?: number;
  reserved_room?: number;
  grand_total: number;
  extra_charge: number;
  status: string;
  booking_no: string;
}
export interface IRoomBookingBody {
  name: string;
  email: string;
  check_in_time: string;
  check_out_time: string;
  check_in: string;
  number_of_nights: number;
  total_occupancy: number;
  discount_amount: number;
  tax_amount: number;
  paid_amount: number;
  pay_status: number;
  ac_tr_ac_id: number;
  nid_no?: string;
  passport_no?: string;
  rooms: IbookingRooms;
  booking_rooms: IbookingRoomItem[];
  payment_type: "bank" | "cash" | "cheque" | "mobile-banking";
  extra_charge: number;
}

interface IbookingRoomItem {
  room_id: number;
  quantity: number;
}

export interface IBookingRooms {
  booking_id: number;
  room_id: number;
}

export interface IbookingRooms {
  id: number;
  room_id: number;
  bed_type: string;
  room_type: string;
  room_number: string;
}

export interface IsingleRoomBooking {
  id: number;
  hotel_id: number;
  user_id: number;
  name: string;
  photo: string;
  email: string;
  nid_no: string;
  passport_no: string;
  booking_no: string;
  check_in_time: string;
  check_out_time: string;
  number_of_nights: number;
  total_occupancy: number;
  grand_total: string;
  status: string;
  created_at: string;
  updated_at: string;
  booking_rooms: IbookingRooms[];
  extra_charge: number;
}

export interface IgetAllRoomBooking {
  id: number;
  hotel_id: number;
  user_id: number;
  name: string;
  photo: string;
  email: string;
  nid_no: string;
  passport_no: string;
  booking_no: string;
  pay_status: number;
  reserved_room: number;
  number_of_nights: number;
  total_occupancy: number;
  grand_total: string;
  status?: string;
  created_at: string;
  updated_at: string;
  booking_rooms: IbookingRooms[];
  extra_charge: number;
}

export interface IupdateManyRoomBooking {
  id?: number;
  hotel_id: number;
  user_id?: number;
  pay_status?: number;
  reserved_room?: number;
  booking_rooms?: IbookingRooms[];
}

export interface IrefundRoomBooking {
  hotel_id: number;
  pay_status: number;
  reserved_room: number;
  status: string;
}

export interface IupdateRoomBooking {
  email?: string;
  check_in_time?: string;
  check_out_time?: string;
  number_of_nights?: number;
  total_occupancy?: number;
  extend_status: number;
  total_extended_nights: number;
  grand_total?: number;
  created_by: number;
  rooms?: IbookingRooms;
  booking_rooms?: IbookingRoomItem[];
}

export interface IupdateRoomPayStatus {
  hotel_id: number;
  pay_status: number;
  reserved_room: number;
}
