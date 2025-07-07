const express = require("express");

const app = express();
const mongoose = require("mongoose");

app.use(express.json());
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use((req, res, next) => {
  req.user = {
    _id: "686849eb46f9d4587d9dc2af",
  };
  next();
});

const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

app.use("/items", clothingItemsRouter);
app.use("/users", usersRouter);

const { NOT_FOUND } = require("./utils/errors");

// Unknown route handler
app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.listen(PORT);
