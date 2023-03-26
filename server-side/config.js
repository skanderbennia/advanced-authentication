import dotenv from "dotenv";
dotenv.config();
const config = {
  development: {
    username: "postgres",
    password: "example",
    database: "postgres",
    logging: false,
    host: process.env.POSTGRES_SERVER || "localhost",
    dialect: "postgres",
    port: process.env.POSTGRES_PORT || 5433
  }
};

export default config;
