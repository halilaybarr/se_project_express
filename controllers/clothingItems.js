const { ClothingItem } = require("../models/clothingItems");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const ForbiddenError = require("../utils/ForbiddenError");

async function getClothingItems(req, res, next) {
  try {
    const clothingItems = await ClothingItem.find({}).populate("owner likes");
    res.status(200).json(clothingItems);
  } catch (error) {
    next(error);
  }
}

async function createClothingItem(req, res, next) {
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
      return next(
        new BadRequestError("Invalid data passed to create clothing item")
      );
    }
    return next(error);
  }
}

async function deleteClothingItem(req, res, next) {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(() => {
      throw new NotFoundError("Clothing item not found");
    });

    if (item.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("You don't have permission to delete this item");
    }

    await ClothingItem.findByIdAndDelete(req.params.itemId);
    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(error);
  }
}

const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Clothing item not found");
    })
    .then((item) => res.status(200).json(item))
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(error);
    });

const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Clothing item not found");
    })
    .then((item) => res.status(200).json(item))
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(error);
    });

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
