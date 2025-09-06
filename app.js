const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const rateLimiter = require("./middlewares/rateLimiter");
const { errors } = require("celebrate");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(rateLimiter);
const { PORT = 3001 } = process.env;

const routes = require("./routes");
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

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db")
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// app.use(cors()); // Already called above

// enable request logger
app.use(requestLogger);

// crash test endpoint for PM2 testing (remove after code review)
// This should be public (before auth)
app.get("/crash-test", (req, res) => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
  res.send("Crash test initiated");
});

app.post("/signin", validateAuthentication, loginUser);
app.post("/signup", validateUserBody, createUser);

app.use(auth);
app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// enabling the error logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
