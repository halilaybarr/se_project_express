const router = require("express").Router();
const clothingItemsController = require("../controllers/clothingitems");

router.get("/", clothingItemsController.getClothingItems);
router.post("/", clothingItemsController.createClothingItem);
router.delete("/:itemId", clothingItemsController.deleteClothingItem);
router.put("/:itemId/like", clothingItemsController.likeItem);
router.delete("/:itemId/like", clothingItemsController.dislikeItem);

module.exports = router;
