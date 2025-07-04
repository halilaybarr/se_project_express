const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
app.use("/items", clothingItemsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
