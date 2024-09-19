const connection = require('../config/db');

const generateBill = (req, res) => {
  const { id } = req.params;
  const bill = `SELECT
                OI.item_id,
                MI.name AS item_name,
                MI.price,
                OI.quantity,
                (MI.price * OI.quantity) AS total_price
              FROM orders AS O
              JOIN orderitems AS OI ON O.order_id = OI.order_id
              JOIN menuitems AS MI ON OI.item_id = MI.item_id
              WHERE O.table_id = (SELECT table_id FROM tables WHERE table_number = ?) 
              AND O.status_id = 3`;

  connection.query(bill, [id], (err, result) => {
    try {
      if (err) throw err;
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send("An error occurred while generating the bill");
    }
  });
};

const getChefOrders = (req, res) => {
  const chefdataquery = `SELECT
                        OI.order_id,
                        MI.name AS item_name,
                        OI.quantity,
                        OI.special_instructions,
                        O.table_id AS table_number
                      FROM orderitems AS OI
                      JOIN orders AS O ON OI.order_id = O.order_id
                      JOIN menuitems AS MI ON OI.item_id = MI.item_id
                      WHERE O.status_id = 2`;

  connection.query(chefdataquery, (err, result) => {
    try {
      if (err) throw err;
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send("An error occurred while retrieving chef data");
    }
  });
};

const updateOrderToDelivered = (req, res) => {
  const { order_id } = req.body;
  const query = `UPDATE orders SET status_id = 3 WHERE order_id = ?`;

  connection.query(query, [order_id], (err) => {
    try {
      if (err) throw err;
      res.status(200).send("Order status updated to delivered successfully");
    } catch (err) {
      res.status(500).send("An error occurred while updating the order status");
    }
  });
};

const updateToJustPaid = (req, res) => {
  const { table_id } = req.body;
  const query = `UPDATE orders SET status_id = 4 WHERE table_id = ? AND status_id = 6`;

  connection.query(query, [table_id], (err) => {
    try {
      if (err) throw err;
      res.status(200).send("Order status updated to 'Just Paid' successfully");
    } catch (err) {
      res.status(500).send("An error occurred while updating the order status");
    }
  });
};

const updateToPaid = (req, res) => {
  const { id } = req.body;
  const query = `UPDATE orders SET status_id = 5 WHERE table_id = ? AND status_id = 4`;

  connection.query(query, [id], (err) => {
    try {
      if (err) throw err;
      res.status(200).send("Order status updated to 'Paid' successfully");
    } catch (err) {
      res.status(500).send("An error occurred while updating the order status");
    }
  });
};

const addReview = (req, res) => {
  const { stars } = req.body;
  const query = "INSERT INTO reviews (stars) VALUES (?)";

  connection.query(query, [stars], (err) => {
    if (err) {
      res.status(500).send("An error occurred while adding the review");
    } else {
      res.status(200).send("Review added successfully");
    }
  });
};

const viewReviews = (req, res) => {
  const avgQuery = `SELECT avg(stars) AS Average FROM reviews`;
  const countQuery = `SELECT stars, count(stars) AS Count FROM reviews GROUP BY stars`;

  connection.query(avgQuery, (err, result1) => {
    try {
      if (err) throw err;
      connection.query(countQuery, (err, result2) => {
        try {
          if (err) throw err;
          const reviewResult = {
            avgStars: result1,
            starsCount: result2
          };
          res.status(200).send(reviewResult);
        } catch (err) {
          res.status(500).send("An error occurred while getting stars count");
        }
      });
    } catch (err) {
      res.status(500).send("An error occurred while getting the average stars");
    }
  });
};

module.exports = {
  generateBill,
  getChefOrders,
  updateOrderToDelivered,
  updateToJustPaid,
  updateToPaid,
  addReview,
  viewReviews
};
