import dotenv from "dotenv";
import path from "path";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Env types
interface ENV {
  PORT: number | undefined;
  DB_NAME: string | undefined;
  DB_PASS: string | undefined;
  DB_USER: string | undefined;
  DB_PORT: string | undefined;
  DB_HOST: string | undefined;
  JWT_SECRET_HOTEL_ADMIN: string | undefined;
  JWT_SECRET_M_ADMIN: string | undefined;
  JWT_SECRET_H_USER: string | undefined;
  JWT_WEBSITE_SECRET_TOKEN: string | undefined;
  JWT_SECRET_H_RESTURANT: string | undefined;
  EMAIL_SEND_EMAIL_ID: string | undefined;
  EMAIL_SEND_PASSWORD: string | undefined;
  AWS_S3_BUCKET: string | undefined;
  AWS_S3_ACCESS_KEY: string | undefined;
  AWS_S3_SECRET_KEY: string | undefined;
}

// Config types
interface Config {
  PORT: number;
  DB_NAME: string;
  DB_PASS: string;
  DB_USER: string;
  DB_PORT: string;
  DB_HOST: string;
  JWT_SECRET_HOTEL_ADMIN: string;
  JWT_SECRET_M_ADMIN: string;
  JWT_SECRET_H_USER: string;
  JWT_SECRET_H_RESTURANT: string;
  JWT_WEBSITE_SECRET_TOKEN: string;
  EMAIL_SEND_EMAIL_ID: string;
  EMAIL_SEND_PASSWORD: string;
  AWS_S3_BUCKET: string;
  AWS_S3_ACCESS_KEY: string;
  AWS_S3_SECRET_KEY: string;
}

// Loading process.env as  ENV interface
const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : 9005,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    JWT_SECRET_HOTEL_ADMIN: process.env.JWT_SECRET_HOTEL_ADMIN,
    JWT_SECRET_M_ADMIN: process.env.JWT_SECRET_M_ADMIN,
    JWT_SECRET_H_USER: process.env.JWT_SECRET_H_USER,
    JWT_WEBSITE_SECRET_TOKEN: process.env.JWT_SECRET_H_USER,
    JWT_SECRET_H_RESTURANT: process.env.JWT_SECRET_H_RESTURANT,
    EMAIL_SEND_EMAIL_ID: process.env.EMAIL_SEND_EMAIL_ID,
    EMAIL_SEND_PASSWORD: process.env.EMAIL_SEND_PASSWORD,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
};

export default getSanitzedConfig(getConfig());
