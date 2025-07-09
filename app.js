const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Move this up with other imports

const app = express();

app.use(express.json());
const { PORT = 3001 } = process.env;

const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const { loginUser, createUser } = require("./controllers/users");
const { getClothingItems } = require("./controllers/clothingitems.js");
const auth = require("./middlewares/auth");
const { NOT_FOUND } = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());

app.post("/signin", loginUser);
app.post("/signup", createUser);

app.get("/items", getClothingItems);

app.use(auth);
app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.listen(PORT);
