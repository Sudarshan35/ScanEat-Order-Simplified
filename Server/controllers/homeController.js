const connection = require('../config/db');

const getHome = (req, res) => {
  const display = "SELECT * FROM menuitems";
  connection.query(display, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
};

const categoryfunc = (category, res) => {
  const displaycategory = `SELECT * FROM menuitems WHERE Subcategory = '${category}' OR Maincategory = '${category}' AND Availability = 1`;
  connection.query(displaycategory, (err, result) => {
    if (err) {
      console.error("An error occurred while retrieving data", err);
      res.status(500).send("An error occurred while retrieving data");
    } else {
      res.send(result);
    }
  });
};

const getCategory = (req, res) => {
  const { category } = req.params;
  categoryfunc(category, res);
};

const getVegItems = (req, res) => {
  const veg = "SELECT * FROM menuitems WHERE Vegonly = 1 AND Availability=1";
  connection.query(veg, (err, result) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
};

const getCart = (req, res) => {
  const { id } = req.params;
  const cartQuery = `
    SELECT
      O.table_id,
      O.order_id,
      O.status_id,
      O.order_time,
      OI.item_id,
      OI.quantity,
      MI.name,
      MI.src
    FROM orders AS O
    JOIN orderitems AS OI ON O.order_id = OI.order_id
    JOIN menuitems AS MI ON OI.item_id = MI.item_id
    WHERE O.table_id = ${id} AND (O.status_id != 4 AND O.status_id != 5);
  `;
  connection.query(cartQuery, (err, result) => {
    if (err) {
      return res.status(500).send("An error occurred while fetching the cart.");
    }
    res.status(200).send(result);
  });
};

const searchItems = (req, res) => {
  const search = req.body.text;
  if (search.length < 2) {
    return res.send("");
  }
  const displaysearch = "SELECT * FROM menuitems WHERE name LIKE ?";
  connection.query(displaysearch, `%${search}%`, (err, result) => {
    if (err) {
      return res.status(500).send("An error occurred while searching");
    }
    res.status(200).send(result);
  });
};

const placeOrder = (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  connection.query(
    `SELECT table_id FROM tables WHERE table_number = ?`,
    id,
    (err, result) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      const table_id = result[0].table_id;
      connection.query(
        `INSERT INTO orders (table_id, status_id) VALUES (?, ?)`,
        [table_id, 1],
        (err, orderResult) => {
          if (err) {
            return res.status(500).send(err.message);
          }
          const order_id = orderResult.insertId;
          const insertItemQuery = 'INSERT INTO orderitems (order_id, item_id, quantity, special_instructions) VALUES (?, ?, ?, ?)';
          obj.items.forEach((item) => {
            connection.query(
              insertItemQuery,
              [order_id, item.item_id, item.quantity, obj.special_instruction || 'none'],
              (err) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send(err.message);
                }
              }
            );
          });
          res.send("Order placed successfully");
        }
      );
    }
  );
};

module.exports = {
  getHome,
  getCategory,
  getVegItems,
  getCart,
  searchItems,
  placeOrder
};
