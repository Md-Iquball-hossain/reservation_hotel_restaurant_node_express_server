export interface ICreateHotelUserPayload {
  hotel_id?: number;
  name: string;
  photo: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  zip_code: string;
  postal_code: string;
  user_type: "guest" | "user";
  password: string;
}