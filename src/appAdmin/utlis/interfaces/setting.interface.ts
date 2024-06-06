
export interface ICreateRoomTypePayload {
    hotel_id: number;
    room_type: string;
}

export interface IUpdateRoomTypePayload {
    hotel_id: number;
    room_type: string;
}

export interface ICreateBedTypePayload {
    hotel_id: number;
    bed_type: string;
}

export interface IUpdateBedTypePayload {
    hotel_id: number;
    bed_type: string;
}

export interface ICreateRoomAmenitiesPayload {
    hotel_id: number;
    room_amenities: string;
}

export interface IUpdateRoomAmenitiesPayload {
    hotel_id: number;
    room_amenities: string;
}

export interface ICreateBankNamePayload {
    hotel_id: number;
    name: string;
}

export interface IUpdateBankName {
    hotel_id: number;
    name: string;
}

export interface ICreatedesignation {
    hotel_id: number;
    name: string;
}

export interface IUpdatedesignation {
    hotel_id: number;
    name: string;
}

export interface ICreatedepartment {
    hotel_id: number;
    name: string;
}

export interface IUpdatedepartment {
    hotel_id: number;
    name: string;
}

export interface ICreateHallAmenitiesPayload {
    hotel_id: number;
    name: string;
    description?: string | null;
}

export interface IUpdateHallAmenitiesPayload {
    hotel_id: number;
    name: string;
    description?: string | null ;
}

export interface ICreatePayrollMonths {
    hotel_id: number;
    name: string;
    days: number;
    hours: number;
}

export interface IUpdatePayrollMonths {
    hotel_id: number;
    name: string;
    days: number;
    hours: number;
}