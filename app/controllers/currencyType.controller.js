const db = require("../models");
const CurrencyType = db.currencyTypes;

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  CurrencyType.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(500).send({
        message:
          err.message ||
          "Some error accurred while retrieving currency types.",
      });
    });
};
