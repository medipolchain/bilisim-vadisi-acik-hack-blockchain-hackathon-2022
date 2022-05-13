require("dotenv").config();

const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { MONGO_DB_PASSWORD, MONGO_DB_USERNAME, JWT_SECRET };
