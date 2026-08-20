import dotenv from "dotenv";
dotenv.config();

interface envConfig {
  NODE_ENV: string;
  PORT:string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET:string;
  REFRESH_TOKEN_SECRET:string;
  ACCESS_TOKEN_EXPIRESIN:string;
  REFRESHH_TOKEN_EXPIRESIN:string;
  BETTER_AUTH_SESSION_TOKEN_EXPIESIN:string;
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE:string;
}

const loadEnvVariable = (): envConfig => {
  const requiementVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRESIN",
    "REFRESHH_TOKEN_EXPIRESIN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIESIN",
"BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE"

  ];
  requiementVariable.forEach((vari) => {
    if (!process.env[vari]) {
      throw new Error(
        `Environment variable ${vari} is required but not set in .env file.`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string ,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRESIN:process.env.ACCESS_TOKEN_EXPIRESIN as string,
    REFRESHH_TOKEN_EXPIRESIN:process.env.REFRESHH_TOKEN_EXPIRESIN as string,
     BETTER_AUTH_SESSION_TOKEN_EXPIESIN:process.env. BETTER_AUTH_SESSION_TOKEN_EXPIESIN as string,
     BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE:process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string
  };
};

export const envVars = loadEnvVariable();
