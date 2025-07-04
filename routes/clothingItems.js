const router = require("express").Router();
const clothingItemsController = require("../controllers/clothingitems");

router.get("/", clothingItemsController.getClothingItems);
router.post("/", clothingItemsController.createClothingItem);
router.delete("/:itemId", clothingItemsController.deleteClothingItem);

module.exports = router;
