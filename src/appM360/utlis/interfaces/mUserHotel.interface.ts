import { ILimitSkip } from "../../../common/types/commontypes";

// create hotel user
export interface ICreateHotelUserPayload {
  name: string;
  logo?: string;
  expiry_date: Date;
  group?: string;
}

// get all hotel user
export interface IgetAllHotelUserPayload extends ILimitSkip {
  name?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  city?: string;
  group?: string;
}

export interface IsingleHotelUserPayload {
  email?: string;
  id?: number;
}

export interface IupdateHotelUser {
  name?: string;
  logo?: string;
  city?: string;
  country?: string;
  address?: string;
  phone?: string;
  map_url?: string;
  website?: string;
  description?: string;
  founded_year?: string;
  zip_code?: string;
  postal_code?: string;
  email?: string;
  expiry_date?: Date;
  password?: string;
  group?: string;
  web_token?: string;
}
