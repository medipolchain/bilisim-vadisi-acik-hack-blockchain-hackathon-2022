const express = require("express");
const cors = require("cors");

// mongoose import
require("./db/mongoose");

// Express application
const app = express();

// cors configuration
app.use(cors());
app.use(express.json());

// routes
const userRoute = require("./routers/users");
const productRoute = require("./routers/products");

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

const PORT = process.env.PORT || 8080;

require("./contract/index");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
