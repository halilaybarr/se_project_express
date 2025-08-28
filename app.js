const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
const { PORT = 3001 } = process.env;

const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const { loginUser, createUser } = require("./controllers/users");
const { getClothingItems } = require("./controllers/clothingItems");
const auth = require("./middlewares/auth");
const NotFoundError = require("./utils/NotFoundError");
const errorHandler = require("./middlewares/error-handler");
const {
  validateAuthentication,
  validateUserBody,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());

// enable request logger
app.use(requestLogger);

app.post("/signin", validateAuthentication, loginUser);
app.post("/signup", validateUserBody, createUser);

app.get("/items", getClothingItems);

app.use(auth);
app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// enabling the error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen(PORT);
