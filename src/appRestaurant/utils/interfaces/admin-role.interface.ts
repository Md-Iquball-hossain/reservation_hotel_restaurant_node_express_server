export interface ILoginRes {
    success: boolean;
    message: string;
    code: number;
    data?: {
    id: number;
    name: string;
    };
    token?: string;
}

export interface ICreateResAdminPayload {
    res_id: number;
    hotel_id: number;
    name: string;
    avatar?: string;
    email: string;
    phone?: string;
    role: number;
    password: string;
    created_by?: number;
}

export interface IUpdateResAdminPayload {
    name?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    role?: number;
    password?: string;
}

export interface IcreateResRolePermission {
    role_id: Number;
    r_permission_id: Number;
    permission_type: String;
    created_by?: Number;
}
