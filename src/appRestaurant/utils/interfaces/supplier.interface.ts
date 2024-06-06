export interface ICreateSupplierPayload {
    res_id: number;
    name: string;
    phone: string;
}

export interface IUpdateSupplierPayload {
    res_id: number;
    name: string;
    phone: string;
    status: number;
}