const express = require('express');
const managerController = require('../controllers/managerController');
const router = express.Router();

router.post("/manager/login", managerController.managerLogin);
router.get("/managers", managerController.getManagersData);
router.put("/managers", managerController.acceptOrder);
router.put("/manager/items", managerController.updateItemAvailability);
router.post("/manager/add", managerController.addItem);
router.delete("/home/manager/items", managerController.deleteItem);
router.post("/manager/sendbill", managerController.sendBill);

module.exports = router;
