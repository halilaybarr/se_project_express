const { User } = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcrypt");

module.exports.getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." })
    );

module.exports.getUser = (req, res) =>
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User creation failed"));
      }
      return user;
    })
    .then((user) => res.status(201).json(user))

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Validation error occurred" });
      } else if (err.name === "MongoServerError" && err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .json({ message: "Email already exists" });
      } else if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};
