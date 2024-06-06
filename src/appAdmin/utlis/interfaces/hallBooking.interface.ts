
export interface IHallBooking {
    hotel_id: number;
    user_id: number;
    start_time: string;
    end_time: string;
    number_of_hours: number;
    total_occupancy: number;
    extra_charge: number ;
    pay_status?: number;
    reserved_hall?: number;
    grand_total: number;
    booking_date: string;
    booking_status: 'confirmed' | 'pending' | 'canceled';
    event_date: string;
    booking_no: string;
    created_by: number,
}

export interface IHallBookingBody {
    name: string;
    email: string;
    country: string;
    phone: number;
    address: string;
    city: string;
    zip_code: number;
    postal_code: number;
    start_time: string;
    end_time: string;
    event_date: string;
    check_in: string;
    number_of_hours: number;
    total_occupancy: number;
    discount_amount: number;
    tax_amount: number;
    pay_status: number;
    paid_amount: number;
    booking_date: string;
    ac_tr_ac_id: number;
    booking_halls: IbookingHallItem[];
    payment_type: 'bank'| 'cash'| 'cheque'| 'mobile-banking';
    extra_charge: number;
}

interface IbookingHallItem {
    hall_id: number;
    quantity: number;
}

export interface IBookingHalls {
    booking_id: number;
    hall_id: number;
}

export interface IbookingHalls {
    id: number;
    hall_id: number;
    name: string;
    hall_status: 'available'|'booked'| 'maintenance';
    rate_per_hour: number;
}

export interface IsingleHallBooking {
    id:number;
    hotel_id: number;
    user_id: number;
    name: string;
    photo: string;
    email: string;
    event_date: string;
    booking_date: string;
    booking_no: string;
    start_time: string;
    end_time: string;
    number_of_hours: number;
    total_occupancy: number;
    grand_total: string;
    booking_status: string;
    created_at: string;
    updated_at: string;
    booking_halls: IbookingHalls[];
    extra_charge: number ;
}

export interface IupdateHallBooking {
    id: number;
    hotel_id: number;
    user_id: number;
    name: string;
    email: string;
    country: string;
    phone: number;
    address: string;
    city: string;
    zip_code: number;
    postal_code: number;
    start_time: string;
    end_time: string;
    number_of_hours: number;
    total_occupancy: number;
    discount_amount: number;
    tax_amount: number;
    pay_status: number;
    booking_date: string;
    event_date: string;
    booking_halls: IbookingHallItem[];
    extra_charge: number;
    }
    
export interface IgetAllHallBooking {
    id: number;
    hotel_id: number;
    user_id: number;
    name: string;
    email: string;
    country: string;
    phone: number;
    address: string;
    city: string;
    zip_code: number;
    postal_code: number;
    start_time: string;
    end_time: string;
    number_of_hours: number;
    total_occupancy: number;
    pay_status: number;
    booking_date: string;
    event_date: string;
    booking_halls: IbookingHallItem[];
    extra_charge: number;
    }

export interface IupdateManyHallBooking {
    id?: number;
    hotel_id: number;
    user_id?: number;
    pay_status?: number;
    reserved_hall?: number;
    booking_halls?: IbookingHalls[];
    }

export interface InsertHallBookingCheckin {
    booking_id: number;
    check_in: string;
    event_date: string;
    created_by: number;
    }

export interface InsertHallBookingCheckOut {
    booking_id: number;
    check_out: string;
    event_date: string;
    created_by: number;
    }