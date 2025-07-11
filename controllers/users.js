const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  AUTHORIZATION_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

function removePassword(user) {
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
}

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
      return removePassword(user);
    })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Validation error occurred" });
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .json({ message: "Email already exists" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Invalid email or password"));
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return Promise.reject(new Error("Invalid email or password"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })
    .catch((err) => {
      if (err.message === "Invalid email or password") {
        return res.status(AUTHORIZATION_ERROR).json({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      const userWithoutPassword = removePassword(user);
      return res.status(200).json(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided" });
      }
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
};
