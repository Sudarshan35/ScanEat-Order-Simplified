// controllers/analyticsController.js
const analyticsModel = require('../models/analyticsModel');

// Daily analytics controller
const getDailyAnalytics = async (req, res) => {
  try {
    const dailySales = await analyticsModel.getDailySales();
    const mostSoldItems = await analyticsModel.getMostSoldItems(`DATE(O.order_time) = CURDATE()`);
    
    const response = {
      dailySales,
      mostSoldItems,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching daily analytics data' });
  }
};

// Weekly analytics controller
const getWeeklyAnalytics = async (req, res) => {
  try {
    const weeklySales = await analyticsModel.getWeeklySales();
    const mostSoldItems = await analyticsModel.getMostSoldItems(`YEAR(O.order_time) = YEAR(CURDATE()) AND WEEK(O.order_time) = WEEK(CURDATE())`);
    
    const response = {
      weeklySales,
      mostSoldItems,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching weekly analytics data' });
  }
};

// Monthly analytics controller
const getMonthlyAnalytics = async (req, res) => {
  try {
    const monthlySales = await analyticsModel.getMonthlySales();
    const mostSoldItems = await analyticsModel.getMostSoldItems(`YEAR(O.order_time) = YEAR(CURDATE()) AND MONTH(O.order_time) = MONTH(CURDATE())`);
    
    const response = {
      monthlySales,
      mostSoldItems,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching monthly analytics data' });
  }
};

// Export all analytics controllers
module.exports = {
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
};
