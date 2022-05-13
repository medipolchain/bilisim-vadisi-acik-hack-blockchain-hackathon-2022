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

app.use("/api/user", userRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
