export interface IURoomBookingBody {
    name: string;
    email: string;
    country: string;
    phone: number;
    address: string;
    city: string;
    zip_code: number;
    postal_code: number;
    nid_no: string;
    passport_no: string;
    check_in_time: string;
    check_out_time: string;
    number_of_nights: number;
    total_occupancy: number;
    discount_amount: number;
    tax_amount: number;
    paid_amount: number;
    ac_tr_ac_id: number;
    booking_rooms: IbookingRoomItem[];
    payment_type: "bank" | "cash" | "cheque" | "mobile-banking";
    extra_charge: number;
}

    interface IbookingRoomItem {
    room_id: number;
    quantity: number;
    }