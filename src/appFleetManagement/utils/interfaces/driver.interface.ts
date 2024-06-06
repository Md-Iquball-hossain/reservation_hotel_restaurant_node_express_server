export interface IcreateDriverPayload {
    hotel_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    blood_group: string;
    photo: string;
    date_of_birth: string;
    licence_number: string;
    licence_photo: string;
    license_class: string;
    expiry_date: Date;
    year_of_experience: number;
    emr_contact_name: string;
    emr_contact_number: number;
    created_by: number;
    }

export interface IupdateDriverPayload {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    blood_group?: string;
    photo?: string;
    date_of_birth?: string;
    licence_number?: string;
    licence_photo?: string;
    license_class?: string;
    expiry_date?: Date;
    year_of_experience?: number;
    emr_contact_name?: string;
    emr_contact_number?: number;
    status? : number;
    updated_by: number;
    }