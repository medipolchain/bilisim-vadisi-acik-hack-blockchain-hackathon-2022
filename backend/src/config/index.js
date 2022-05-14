require("dotenv").config();

const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME;
const JWT_SECRET = process.env.JWT_SECRET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const HTTP_PROVIDER = process.env.PROVIDER_URL_HTTP;
const WS_PROVIDER = process.env.PROVIDER_URL_WS;

module.exports = {
  MONGO_DB_PASSWORD,
  MONGO_DB_USERNAME,
  JWT_SECRET,
  PRIVATE_KEY,
  HTTP_PROVIDER,
  WS_PROVIDER,
};
