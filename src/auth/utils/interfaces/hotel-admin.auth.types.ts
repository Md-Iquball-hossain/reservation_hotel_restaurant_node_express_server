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

export interface ICreateUserAdminPayload {
  hotel_id: number;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  role: number;
  password: string;
}

export interface IUpdateAdminPayload {
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: number;
  password?: string;
}
