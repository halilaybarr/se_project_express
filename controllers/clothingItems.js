const { ClothingItem } = require("../models/clothingItems");

async function getClothingItems(req, res) {
  try {
    const clothingItems = await ClothingItem.find({}).populate("owner likes");
    res.status(200).json(clothingItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clothing items" });
  }
}

async function createClothingItem(req, res) {
  const { name, weather, imageUrl, owner } = req.body;
  try {
    const newClothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner,
    });
    await newClothingItem.save();
    res.status(201).json(newClothingItem);
  } catch (error) {
    res.status(400).json({ message: "Error creating clothing item", error });
  }
}

async function deleteClothingItem(req, res) {
  try {
    const clothingItem = await ClothingItem.findByIdAndDelete(
      req.params.itemId
    );
    if (!clothingItem) {
      return res.status(404).json({ message: "Clothing item not found" });
    }
    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting clothing item", error });
  }
}

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
};
