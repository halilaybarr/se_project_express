const router = require("express").Router();
const clothingItemsController = require("../controllers/clothingItems");
const { validateCardBody, validateId } = require("../middlewares/validation");

router.post("/", validateCardBody, clothingItemsController.createClothingItem);
router.delete(
  "/:itemId",
  validateId,
  clothingItemsController.deleteClothingItem
);
router.put("/:itemId/likes", validateId, clothingItemsController.likeItem);
router.delete(
  "/:itemId/likes",
  validateId,
  clothingItemsController.dislikeItem
);

module.exports = router;
