
const connection = require('../config/db'); 


const getDailySales = () => {
  const query = `
    SELECT DATE(O.order_time) AS sale_date, SUM(MI.price * OI.quantity) AS daily_sales
    FROM orders AS O
    JOIN orderitems AS OI ON O.order_id = OI.order_id
    JOIN menuitems AS MI ON OI.item_id = MI.item_id
    JOIN tables AS T ON O.table_id = T.table_id
    WHERE DATE(O.order_time) = CURDATE()
    GROUP BY sale_date
    ORDER BY sale_date;
  `;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Fetch weekly sales data
const getWeeklySales = () => {
  const query = `
    SELECT DATE(O.order_time) AS sale_date, SUM(MI.price * OI.quantity) AS daily_sales
    FROM orders AS O
    JOIN orderitems AS OI ON O.order_id = OI.order_id
    JOIN menuitems AS MI ON OI.item_id = MI.item_id
    JOIN tables AS T ON O.table_id = T.table_id
    WHERE YEAR(O.order_time) = YEAR(CURDATE()) 
    AND WEEK(O.order_time) = WEEK(CURDATE())
    GROUP BY sale_date
    ORDER BY sale_date;
  `;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Fetch monthly sales data
const getMonthlySales = () => {
  const query = `
    SELECT DATE(O.order_time) AS sale_date, SUM(MI.price * OI.quantity) AS daily_sales
    FROM orders AS O
    JOIN orderitems AS OI ON O.order_id = OI.order_id
    JOIN menuitems AS MI ON OI.item_id = MI.item_id
    JOIN tables AS T ON O.table_id = T.table_id
    WHERE YEAR(O.order_time) = YEAR(CURDATE()) 
    AND MONTH(O.order_time) = MONTH(CURDATE())
    GROUP BY sale_date
    ORDER BY sale_date;
  `;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Fetch most sold items for a period (daily/weekly/monthly)
const getMostSoldItems = (periodCondition) => {
  const query = `
    SELECT MI.item_id, MI.name AS item_name, MI.src, MI.price, SUM(OI.quantity) AS total_quantity_sold
    FROM orderitems AS OI
    JOIN menuitems AS MI ON OI.item_id = MI.item_id
    JOIN orders AS O ON O.order_id = OI.order_id
    JOIN tables AS T ON O.table_id = T.table_id
    WHERE ${periodCondition}
    GROUP BY MI.item_id
    ORDER BY total_quantity_sold DESC
    LIMIT 10;
  `;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Export all functions
module.exports = {
  getDailySales,
  getWeeklySales,
  getMonthlySales,
  getMostSoldItems,
};
