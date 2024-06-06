
interface IupdateRestaurantPayload {
    name?: string;
    phone?: number;
    photo?: string;
    address?: string;
    city?: string;
    country?: string;
    bin_no?: number;
    status?: number;
    updated_by: number;
}

interface IupdateRestAdminPayload {
    name?: string;
    phone?: number;
    status?: string;
    avatar?: string; 
    updated_by: number;
}