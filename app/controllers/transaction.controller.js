const db = require("../models");
const Transaction = db.transactions;

// Create and Save a new transaction
exports.create = (req, res) => {
  // Create a transation
  const transaction = {
    type: req.body.type,
    amount: req.body.amount,
    exchange_rate: req.body.exchange_rate,
    categoryId: req.body.categoryId,
    accountId: req.body.accountId,
    currencyTypeId: req.body.currencyTypeId
  };

  // Save transaction in database
  Transaction.create(transaction)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Transaction."
      });
    });
};

// Retrieve all transactions from the database.
exports.findAll = (req, res) => {
    Transaction.findAll()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Ocurrió un error al recuperar las transacciones.",
        });
      });
  };
  

// Find a single transactions with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Transaction.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving Transaction with id = ${id}`
      });
    });
};

// Update a transactions by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Transaction.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Transaction was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Transaction with id=" + id
      });
    });
};

// Delete a Transaction with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Transaction.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Transaction was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Transaction with id=" + id
      });
    });
};

// Delete all transactions from the database.
exports.deleteAll = (req, res) => {
    Transaction.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Transactions were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all transactions."
      });
    });
};
