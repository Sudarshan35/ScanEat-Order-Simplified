
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');


router.post('/manager/analytics/daily', analyticsController.getDailyAnalytics);
router.post('/manager/analytics/weekly', analyticsController.getWeeklyAnalytics);


router.post('/manager/analytics/monthly', analyticsController.getMonthlyAnalytics);

module.exports = router;
