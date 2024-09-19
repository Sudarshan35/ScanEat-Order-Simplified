const express = require("express");
const app = express();
const cors = require('cors');
const port = 3306;

const homeRoutes = require('../routes/homeRoutes');
const managerRoutes = require('../routes/managerRoutes');
const chefRoutes=require("../routes/chefRoutes");
const analytics=require("../routes/analyticsRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', homeRoutes);
app.use('/', managerRoutes);
app.use('/',chefRoutes);
app.use('/',analytics)
app.listen(port, () => {
  console.log("listening to the port ", port);
});
