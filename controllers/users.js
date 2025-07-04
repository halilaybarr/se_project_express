const User = require("../models/user");
const router = require("express").Router();


module.exports = router;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) =>
      res.status(500).json({ message: "Error fetching users", error: err })
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) =>
      res.status(500).json({ message: "Error fetching user", error: err })
    );
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  const newUser = new User({ name, avatar });

  newUser
    .save()
    .then((user) => res.status(201).json(user))
    .catch((err) =>
      res.status(400).json({ message: "Error creating user", error: err })
    );
};
