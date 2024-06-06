export interface IcreateVehiclePayload {
    hotel_id: number;
    reg_number: string;
    model: string;
    mileage: number;
    manufacturer: string;
    manufacture_year: Date;
    license_plate: string;
    tax_token: string;
    token_expired: Date;
    insurance_number: string;
    insurance_expired: Date;
    vehicle_type: string;
    fuel_type: string;
    vehicle_color: string;
    vehicle_photo: string;
    created_by: number;
    }

export interface IupdateVehiclePayload {
    owner_id?: number;
    reg_number?: string;
    model?: string;
    mileage?: number;
    manufacturer?: string;
    manufacture_year?: Date;
    license_plate?: string;
    tax_token?: string;
    token_expired?: Date;
    insurance_number?: string;
    insurance_expired?: Date;
    vehicle_type?: string;
    fuel_quantity? : string;
    fuel_type?: string;
    status?: string;
    vehicle_color?: string;
    vehicle_photo?: string;
    parking_status?: number;
    updated_by?: number;
    }