import dotenv from "dotenv";

dotenv.config();

// Fail fast if critical secrets are missing — prevents silent startup with insecure defaults
const requiredEnvVars = [
  "MONGODB_URI",
  "DB_NAME",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const;

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
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
  resend: {
    apiKey: string;
    fromEmail: string;
  };
  myEmail: string;
  seedSecret: string;
  superAdmin: {
    name: string;
    email: string;
    password: string;
  };
  appUrl: {
    frontendUrl: string;
    backendUrl: string;
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
  superAdmin: {
    name: process.env.SUPER_ADMIN_NAME || "",
    email: process.env.SUPER_ADMIN_EMAIL || "",
    password: process.env.SUPER_ADMIN_PASSWORD || "",
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    fromEmail: process.env.RESEND_FROM_EMAIL || "",
  },
  myEmail: process.env.MY_EMAIL || "ranokraihan@gmail.com",
  seedSecret: process.env.SEED_SECRET || "",
  appUrl: {
    frontendUrl: process.env.FRONTEND_URL || "",
    backendUrl: process.env.BACKEND_URL || "",
  },
};
