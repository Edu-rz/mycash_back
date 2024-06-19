const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app/config/config.js");
const app = express();
const db = require("./app/models");
const loadInitialData = require("./app/seeders/loadInitialData.js");

// const corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const Role = db.role;
db.sequelize.sync({ force: false }).then(() => {
  loadInitialData();
});

// simple route
app.get("/api/", (req, res) => {
  res.json({ message: "Hola pato 🦆" });
});

// api routes
//require("./app/routes/book.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/account.routes")(app);
require("./app/routes/currencyType.routes.js")(app);
require("./app/routes/objective.routes.js")(app);
require("./app/routes/category.routes.js")(app);
require("./app/routes/transaction.routes.js")(app);

// set port, listen for requests
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
