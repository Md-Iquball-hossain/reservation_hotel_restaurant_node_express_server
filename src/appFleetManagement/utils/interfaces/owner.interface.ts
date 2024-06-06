export interface IcreateOwnerPayload {
    hotel_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    occupation: string;
    photo: string;
    documents: string;
    created_by: number;
    }

export interface IupdateOwnerPayload {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    occupation?: string;
    photo?: string;
    documents?: string;
    status?: number;
    updated_by: number;
    }