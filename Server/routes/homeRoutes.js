const express = require('express');
const homeController = require('../controllers/homeController');
const router = express.Router();

router.get("/home/:id", homeController.getHome);
router.get("/home/:id/:category", homeController.getCategory);
router.get("/veg", homeController.getVegItems);
router.get("/home/:id/abc/cart", homeController.getCart);
router.post("/home/:id", homeController.searchItems);
router.post("/home/:id/abc/placeOrder", homeController.placeOrder);

module.exports = router;
