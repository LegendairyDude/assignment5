const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getInventory);
router.post('/category', inventoryController.createCategory);
router.post('/item', inventoryController.createItem);
router.post('/item/remove', inventoryController.removeItemQuantity);

module.exports = router;
