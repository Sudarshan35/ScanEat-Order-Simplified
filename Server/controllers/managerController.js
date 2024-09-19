const connection = require('../config/db');

const managerLogin = (req, res) => {
  const { username, password } = req.body;
  const authquery = `SELECT * FROM managers WHERE name=? AND password=?`;

  connection.query(authquery, [username, password], (err, result) => {
    try {
      if (err) throw err;
      if (result.length > 0) {
        res.send("1");
      } else {
        res.send("0");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred");
    }
  });
};

const getManagersData = (req, res) => {
  const Manquery = `
    SELECT O.order_id, T.table_number, OI.item_id, MI.name AS item_name, 
           MI.price, OI.quantity, OS.status_name AS status
    FROM orders AS O 
    JOIN tables AS T ON O.table_id = T.table_id
    JOIN orderitems AS OI ON O.order_id = OI.order_id
    JOIN menuitems AS MI ON OI.item_id = MI.item_id
    JOIN orderstatuses AS OS ON O.status_id = OS.status_id
    WHERE O.status_id != 5`;

  connection.query(Manquery, (err, result) => {
    try {
      if (err) throw err;
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching data");
    }
  });
};

const acceptOrder = (req, res) => {
  const { order_id } = req.body;
  const Macceptquery = `UPDATE orders SET status_id=2 WHERE order_id=?`;

  connection.query(Macceptquery, order_id, (err) => {
    try {
      if (err) throw err;
      res.send("Order accepted successfully");
    } catch (err) {
      res.status(500).send(err);
    }
  });
};

const updateItemAvailability = (req, res) => {
  const { item_id, status } = req.body;
  const unavlquery = `UPDATE menuitems SET availability=${status} WHERE item_id=${item_id}`;

  connection.query(unavlquery, (err) => {
    try {
      if (err) throw err;
      res.status(200).json({ message: "Data updated successfully." });
    } catch (err) {
      res.status(500).send("An error occurred while updating the data");
    }
  });
};

const addItem = (req, res) => {
  const { itemData } = req.body;
  const addquery = `INSERT INTO menuitems (item_id, name, description, price, Maincategory, src, Subcategory, Recommended, Availability, Vegonly)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(addquery, [
    itemData.item_id, itemData.name, itemData.description, itemData.price, 
    itemData.Maincategory, itemData.src, itemData.Subcategory, 
    itemData.Recommended, 1, itemData.vegonly
  ], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred while adding data." });
    }
    res.status(200).json({ message: "Data added successfully." });
  });
};

const deleteItem = (req, res) => {
  const { id } = req.body;
  const delquery = `DELETE FROM menuitems WHERE item_id=${id}`;

  connection.query(delquery, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred while deleting data." });
    }
    res.status(200).json({ message: "Data deleted successfully." });
  });
};

const sendBill = (req, res) => {
  const { table_id } = req.body;
  const query = `UPDATE orders SET status_id=6 WHERE table_id=${table_id} AND status_id=3`;

  connection.query(query, (err) => {
    try {
      if (err) throw err;
      res.status(200).send("Status updated successfully");
    } catch (err) {
      res.status(500).send("An error occurred while sending the bill");
    }
  });
};

module.exports = {
  managerLogin,
  getManagersData,
  acceptOrder,
  updateItemAvailability,
  addItem,
  deleteItem,
  sendBill
};
