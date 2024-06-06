export interface IcreateRoomBody {
  room_number: string;
  hotel_id: number;
  room_type?: string | null;
  room_size?: string | null;
  room_view: string;
  occupancy?: number | null;
  bed_type?: string | null;
  rate_per_night: number;
  discount_percent?: number | null;
  description?: string | null;
  refundable?: number;
  tax_percent?: number | null;
  discount?: number | null;
  refundable_time?: number | null;
  refundable_charge?: number | null;
  aminities_charge?: number | null;
  room_amenities: string | null;
}

export interface IRoomNumber {
  id: number;
  room_number: string;
}

export interface IcreateRoomPayload {
  room_number: string;
  hotel_id: number;
  room_type?: string | null;
  room_size?: string | null;
  room_view: string;
  occupancy?: number | null;
  bed_type?: string | null;
  rate_per_night: number;
  discount_percent?: number | null;
  tax_percent?: number | null;
  description?: string | null;
  refundable?: number;
  discount?: number | null;
  refundable_time?: number | null;
  refundable_charge?: number | null;
  aminities_charge?: number | null;
}

export interface IupdateroomPayload {
  room_number?: string;
  room_type?: string;
  room_size?: string;
  occupancy?: number | null;
  bed_type?: string;
  room_view?: string;
  pay_status?: number;
  reserved_room?: number;
  rate_per_night?: number;
  availability?: number;
  discount?: number | null;
  discount_percent?: number | null;
  tax_percent?: number | null;
  refundable?: number;
  refundable_time?: number | null;
  refundable_charge?: number | null;
  description?: string | null;
  aminities_charge?: number | null;
  room_amenities?: string;
  remove_amenities?: string;
  remove_photos?: string;
}

export interface IroomImage {
  room_id: number;
  photo: string;
}

export interface IgetAllRoom {
  id: number;
  room_number?: string;
  room_type?: string;
  bed_type?: string;
  refundable?: number;
  from_date?: string;
  to_date?: string;
  rate_per_night: number;
  child?: number;
  adult?: number;
  availability?: number;
  occupancy?: string;
  room_created_at?: string;
  limit?: string;
  skip?: string;
}

export interface ICheckRoomAmenities {
  rah_id: number;
  room_id: number;
}
