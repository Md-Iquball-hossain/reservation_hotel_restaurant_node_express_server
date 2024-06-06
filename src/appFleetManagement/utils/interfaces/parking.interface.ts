export interface IcreateParkingPayload {
    hotel_id: number;
    parking_area: string;
    parking_size: string;
    par_slot_number: string;
    created_by: number;
    }

export interface IupdateParkingPayload {
    parking_area?: string;
    parking_size?: string;
    par_slot_number?: string;
    status: number;
    updated_by: number;
    }

export interface IcreateVehicleParkingPayload {
    vehicle_id : number;
    parking_id : number;
    assigned_time: Date;
    left_time : Date;
    status : number;
    created_by: number;
    }

export interface IupdateVehicleParkingPayload {
    vehicle_id? : number;
    left_time? : Date;
    status? : number;
    updated_by: number;
    }