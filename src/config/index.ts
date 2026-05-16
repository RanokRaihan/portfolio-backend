import dotenv from "dotenv";

dotenv.config();

// Fail fast if critical secrets are missing — prevents silent startup with insecure defaults
const requiredEnvVars = [
  "MONGODB_URI",
  "DB_NAME",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

type TConfig = {
  nodeEnv: string;
  port: string;
  db: {
    uri: string;
    name: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  bcrypt: {
    saltRounds: string;
  };
  resetPassUiLink: string;
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  shurjoPay: {
    endpoint: string;
    username: string;
    password: string;
    prefix: string;
    returnUrl: string;
  };
};

export const config: TConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || "5000",
  db: {
    uri: process.env.MONGODB_URI || "",
    name: process.env.DB_NAME || "",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS || "10",
  },
  resetPassUiLink: process.env.RESET_PASS_UI_LINK || "",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  shurjoPay: {
    endpoint: process.env.SP_ENDPOINT || "",
    username: process.env.SP_USERNAME || "",
    password: process.env.SP_PASSWORD || "",
    prefix: process.env.SP_PREFIX || "",
    returnUrl: process.env.SP_RETURN_URL || "",
  },
};
