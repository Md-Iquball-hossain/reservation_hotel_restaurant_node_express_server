import { Knex } from "knex";

// Db or Transaction connection types
export type TDB = Knex | Knex.Transaction;

// user admin types
export interface IAdmin {
  hotel_id: number;
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: 0 | 1;
  type: string;
}

// hotel user types
export interface IhotelUser {
  id: number;
  hotel_id: number;
  name: string;
  city: string;
  email: string;
  logo: string | null;
  status: "active" | "blocked" | "expired";
  type: string;
}

// hotel user types
export interface IrestUser {
  id: number;
  res_id: number;
  hotel_id: number;
  name: string;
  email: string;
  status: "active" | "blocked" | "inactive";
  type: string;
}

export interface IWebToken {
  id: number;
}

// user member types
export interface IUser {
  id: number;
  agency_id: number;
  applicationId: number;
  companyId: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "blacklisted" | "disabled";
}

// forget password props interface
export interface IForgetPassProps {
  password: string;
  table: string;
  passField: string;
  userEmailField: string;
  userEmail: string;
}

// user member registration types
export interface IRegistration {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  companyName: string | null;
  designation?: string;
  status?: string;
}

// login interface
export interface ILogin {
  email: string;
  password: string;
}

export interface IPromiseRes<T> {
  success: boolean;
  message?: string;
  code: number;
  data?: T;
}

export interface IChangePassProps {
  password: string;
  passField: string;
  table: string;
  schema: string;
  userIdField: string;
  userId: number;
}
export interface IUpdateChangePassModelProps {
  hashedPass: string;
  passField: string;
  table: string;
  schema: string;
  userIdField: string;
  userId: number;
}

// verify password props interface
export interface IVerifyPassProps {
  oldPassword: string;
  userId: number;
  schema: string;
  table: string;
  passField: string;
  userIdField: string;
}

export interface IVerifyModelPassProps {
  schema: string;
  userId: number;
  table: string;
  passField: string;
  userIdField: string;
}

//  JWT CARD INFO
export interface ITokenCards {
  user_username: string;
  user_full_name: string;
  user_role_id: number;
  user_id: number;
  user_agency_id: number;
}

export interface ILimitSkip {
  limit: string;
  skip: string;
}
