const { ClothingItem } = require("../models/clothingItems");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

async function getClothingItems(req, res) {
  try {
    const clothingItems = await ClothingItem.find({}).populate("owner likes");
    res.status(200).json(clothingItems);
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
}

async function createClothingItem(req, res) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  try {
    const newClothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner,
    });
    await newClothingItem.save();
    return res.status(201).json(newClothingItem);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data passed to create clothing item" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
}

async function deleteClothingItem(req, res) {
  try {

    const item = await ClothingItem.findById(req.params.itemId).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(FORBIDDEN_ERROR).json({
        message: "You don't have permission to delete this item",
      });
    }


    await ClothingItem.findByIdAndDelete(req.params.itemId);
    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    if (error.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
  return null;
}

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).json(item))
    .catch((error) => {
      // console.error(error);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      if (error.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: error.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).json(item))
    .catch((error) => {
      // console.error(error);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      if (error.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: error.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
