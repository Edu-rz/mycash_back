const db = require("../models");
const Transaction = db.transactions;
const Account = db.accounts;
const { validationResult } = require("express-validator");

// Create and Save a new transaction
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { amount, accountId, type, categoryId, currencyTypeId } = req.body;

  try {
    // Iniciar una transacción en la base de datos
    const result = await db.sequelize.transaction(async (t) => {
      // Encontrar la cuenta a la que se le va a realizar la transacción
      const account = await Account.findByPk(accountId, { transaction: t });

      if (!account) {
        throw new Error("Cuenta no existe");
      }

      // Calcular el nuevo balance dependiendo del tipo de transacción
      let newBalance;
      if (type !== 'Ingreso') {
        newBalance = parseFloat(account.balance) - parseFloat(amount);
        if (newBalance < 0) {
          throw new Error("Saldo insuficiente");
        }
      } else {
        newBalance = parseFloat(account.balance) + parseFloat(amount);
      }

      // Actualizar el balance de la cuenta
      account.balance = newBalance;
      await account.save({ transaction: t });

      // Crear la transacción
      const transaction = await Transaction.create({
        amount: amount,
        accountId: accountId,
        type: type,
        categoryId: categoryId,
        currencyTypeId: currencyTypeId,
      }, { transaction: t });

      return transaction;
    });

    // Enviar la respuesta con éxito
    return res.status(200).json({
      message: "Transacción creada exitosamente",
      transaction: result,
    });

  } catch (error) {
    // Manejo de errores y envío de respuesta de error
    return res.status(500).json({
      message: error.message || "Ocurrió un error durante la creación de la transacción.",
    });
  }
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

exports.sumByMonth = async (req, res) => {
  try{
    const transaccions = await Transaction.findAll();

    const sumByMonth = {};

    transaccions.forEach(transaction => {
      const date = new Date(transaction.createdAt);
      const month = date.getMonth();
      if (!sumByMonth[month]){
        sumByMonth[month] = 0;
      }

      sumByMonth[month] += transaction.amount;
    });

    res,json(sumByMonth);
  }catch(error){
    console.error('Error al obtener la suma por mes: ', error);
    
  }
};

  exports.IncomeSumByCategory = async (req, res) => {
    try{
      const incomeSumByCategory = await Transaction.findAll({
        attributes: ['categoryId', [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']],
        where: {
          type: 'Ingreso'
        },
        group: ['categoryId']
      });
      res.json(incomeSumByCategory);
    }catch(error){
      console.error('Error al obtener la suma de ingresos por categoria', error);
    }
  };
  
  exports.ExpenseSumByCategory = async (req, res) => {
    try{
      const expenseSumByCategory = await Transaction.findAll({
      attributes: ['categoryId', [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total']],
      where: {
        type: 'Egreso'
      },
      group: ['categoryId']
    });
    res.json(expenseSumByCategory);
  }catch(error){
    console.error('Error al obtener la suma de egresos por categoria', error);
  }
};
