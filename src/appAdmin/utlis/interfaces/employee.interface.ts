export interface IcreateEmployee {
  name: string;
  photo?: string;
  department_id: number;
  designation_id: number;
  res_id: number;
  blood_group?: string;
  salary: number;
  email?: string;
  mobile_no: string;
  birth_date?: string;
  category: string;
  appointment_date?: string;
  joining_date?: string;
  address?: string;
  hotel_id: number;
}

export interface IupdateEmployee {
  name: string;
  email: string;
  photo?: string;
  department_id: number;
  designation_id: number;
  res_id: number;
  blood_group?: string;
  salary: number;
  mobile_no: string;
  birth_date?: string;
  category: string;
  appointment_date?: string;
  joining_date?: string;
  status?:number;
  address?: string;
  hotel_id: number;
}