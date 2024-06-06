export interface ICreateRestaurantPayload {
    hotel_id: number;
    name: string;
    email: string;
    phone: number;
    created_by: number;
}

export interface ICreateResAdminPayload {
    hotel_id: number;
    res_id: number;
    name: string;
    email: string;
    password: string;
    created_by: number;
}

export interface IupdateResAdminPayload {
    hotel_id: number;
    status: number;
    updated_by: number;
}



