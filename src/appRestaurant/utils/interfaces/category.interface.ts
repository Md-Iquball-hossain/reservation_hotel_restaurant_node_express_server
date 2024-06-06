export interface ICreateCategoryPayload {
    res_id: number;
    name: string;
}

export interface IUpdateCategoryPayload {
    res_id: number;
    name: string;
    status: number;
}