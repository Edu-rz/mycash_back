const { validationResult } = require("express-validator");
const db = require("../models");
const Account = db.accounts;
const CurrencyType = db.currencyTypes;
const Op = db.Op;

// Create and Save a new Account
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // user Id
    const userId = req.userId;

    // Create an Account
    const account = {
      name: req.body.name,
      balance: req.body.balance,
      currencyTypeId: req.body.currencyTypeId,
      userId: userId,
    };

    // Save Account in database
    const result = await Account.create(account);

    return res.status(200).json({
      message: "Account created succesfully",
      result: result,
    });
  }
  res.status(422).json({ errors: errors.array() });
};

// Retrieve all accounts from the database.
exports.findAll = (req, res) => {
  // user Id
  const userId = req.userId;

  Account.findAll({
    where: {
      userId: userId,
    },
    include: [{ model: CurrencyType }], // Include the CurrencyType model
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving user's accounts.",
      });
    });

};

exports.delete = (req, res) => {
  const id = req.params.id;

  Account.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Account was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Account with id=${id}. Maybe Account was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Account with id=" + id,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Account.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving Account with id = ${id}`,
      });
    });
};

// Update a Account by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Account.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Account was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Account with id=" + id,
      });
    });
};

// Delete all Accounts from the database.
exports.deleteAll = (req, res) => {
  Account.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Accounts were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all accounts.",
      });
    });
};

// Find all published Accounts
exports.findAllPublished = (req, res) => {
  Account.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving books.",
      });
    });
};
