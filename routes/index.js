const express = require('express');
const clothingItemsRouter = require('./clothingItems');
const usersRouter = require('./users');

const router = express.Router();

router.use('/items', clothingItemsRouter);
router.use('/users', usersRouter);

module.exports = router;
