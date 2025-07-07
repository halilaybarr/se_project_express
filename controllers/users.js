const { User } = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
  return null;
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
  return null;
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  const newUser = new User({ name, avatar });

  newUser
    .save()
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Validation error occurred" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
  return null;
};
