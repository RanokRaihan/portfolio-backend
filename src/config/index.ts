import dotenv from "dotenv";

// congigure dotenv
dotenv.config();

// export environment variables
export const {
  NODE_ENV: node_env,
  MONGODB_URI: mongodb_uri,
  PORT: port,
  BCRYPT_SALT_ROUNDS: bcrypt_salt_rounds,
  DB_NAME: db_name,
  JWT_ACCESS_SECRET: jwt_access_secret,
  JWT_REFRESH_SECRET: jwt_refresh_secret,

  JWT_ACCESS_EXPIRES_IN: jwt_expires_in,
  JWT_REFRESH_EXPIRES_IN: jwt_refresh_expires_in,
  RESET_PASS_UI_LINK: reset_pass_ui_link,
  CLOUDINARY_CLOUD_NAME: cloudinary_cloud_name,
  CLOUDINARY_API_KEY: cloudinary_api_key,
  CLOUDINARY_API_SECRET: cloudinary_api_secret,

  SP_ENDPOINT: sp_endpoint,
  SP_USERNAME: sp_username,
  SP_PASSWORD: sp_password,

  SP_PREFIX: sp_prefix,
  SP_RETURN_URL: sp_return_url,
} = process.env;
