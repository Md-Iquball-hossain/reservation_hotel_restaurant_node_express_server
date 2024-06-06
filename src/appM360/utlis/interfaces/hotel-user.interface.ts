export interface IUpdateUser {
    hotel_id: number;
    name?: string;
    phone?: string;
    email: string;
    photo?: string;
    country?: string;
    city?: string;
    address?: string;
    zip_code?: number;
    postal_code?: number;
    passport_no?: string;
    nid_no?: string;
    user_type?: 'guest' | 'user';
    last_balance?: number;
    status?: 'active' | 'inactive' | 'blocked';
}

export interface IUpdateUserPayload {
    email?: string;
    password: string;
}