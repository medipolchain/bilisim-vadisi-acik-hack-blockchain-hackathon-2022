const mongoose = require("mongoose");

const { MONGO_DB_USERNAME, MONGO_DB_PASSWORD } = require("../config/index");

mongoose.connect(
  `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.aipgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected successfully.");
    }
  }
);
