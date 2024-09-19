const express = require('express');
const chefController=require('../controllers/chefController')
const router = express.Router();

router.get("/manager/bill/:id", chefController.generateBill);
router.get("/chef", chefController.getChefOrders);
router.put("/chef", chefController.updateOrderToDelivered);
router.put("/manager/bill", chefController.updateToJustPaid);
router.put("/manager/bill/remove", chefController.updateToPaid);
router.post("/home/:id/:category/reviews", chefController.addReview);
router.get("/home/:id/:category/reviews", chefController.viewReviews);

module.exports = router;
