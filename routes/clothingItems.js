const router = require("express").Router();
const clothingItemsController = require("../controllers/clothingItems");

router.get("/", clothingItemsController.getClothingItems);
router.post("/", clothingItemsController.createClothingItem);
router.delete("/:itemId", clothingItemsController.deleteClothingItem);
router.put("/:itemId/likes", clothingItemsController.likeItem);
router.delete("/:itemId/likes", clothingItemsController.dislikeItem);

module.exports = router;
