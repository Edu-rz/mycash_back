const db = require("../models");
const Transaction = db.transactions;
const Account = db.accounts;
const Category = db.categories;
const User = db.user;
const CurrencyType = db.currencyTypes;
const { validationResult } = require("express-validator");
const { Sequelize, Op } = require("sequelize");

// Create and Save a new transaction
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { amount, accountId, categoryId, currencyTypeId, exchange_rate } = req.body;

  try {
    // Iniciar una transacción en la base de datos
    const result = await db.sequelize.transaction(async (t) => {
      // Encontrar la cuenta a la que se le va a realizar la transacción
      const account = await Account.findByPk(accountId, {
        include: [{ model: CurrencyType }],
        transaction: t
      });

      if (!account) {
        throw new Error("Cuenta no existe");
      }

      // Obtener el tipo de cambio de la cuenta
      const accountCurrencyType = account.CurrencyType;

      // Calcular el monto en la moneda de la cuenta
      let amountInAccountCurrency = amount;
      if (accountCurrencyType.id !== currencyTypeId) {
        if (!exchange_rate || exchange_rate <= 0) {
          throw new Error("Tipo de cambio inválido");
        }
        amountInAccountCurrency = amount * exchange_rate;
      }

      // Calcular el nuevo balance de la cuenta
      let newBalance = parseFloat(account.balance) + parseFloat(amountInAccountCurrency);

      // Actualizar el balance de la cuenta
      account.balance = newBalance;
      await account.save({ transaction: t });

      // Crear la transacción
      const transaction = await Transaction.create(
        {
          amount: amount,
          accountId: accountId,
          categoryId: categoryId,
          currencyTypeId: currencyTypeId,
          exchange_rate: exchange_rate,
        },
        { transaction: t }
      );

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
      message:
        error.message ||
        "Ocurrió un error durante la creación de la transacción.",
    });
  }
};

// Retrieve all transactions for a user
exports.findAll = (req, res) => {
  const userId = req.userId;
  const accountId = req.query.accountId;

  const includeOptions = {
    model: Account,
    include: {
      model: Transaction,
    },
  };

  // If accountId is provided, add it to the where clause
  if (accountId) {
    includeOptions.where = { id: accountId };
  }

  User.findOne({
    where: { id: userId },
    include: includeOptions,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `No se encontró el usuario con id=${userId}.`,
        });
      }

      // Extract all transactions from the user's accounts
      const transactions = user.Accounts.reduce((acc, account) => {
        return acc.concat(account.Transactions);
      }, []);

      // Calculate the total amount of all transactions
      const totalAmount = transactions.reduce((sum, transaction) => {
        return sum + transaction.amount;
      }, 0);

      // Structure the response
      const response = {
        amount: totalAmount,
        transacciones: transactions,
      };

      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al recuperar las transacciones.",
      });
    });
};

// Find a single transactions with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Transaction.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving Transaction with id = ${id}`,
      });
    });
};

// Update a transactions by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Transaction.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Transaction was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Transaction with id=${id}. Maybe Transaction was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Transaction with id=" + id,
      });
    });
};

// Delete a Transaction with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Transaction.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Transaction was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Transaction with id=" + id,
      });
    });
};

// Delete all transactions from the database.
exports.deleteAll = (req, res) => {
  Transaction.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Transactions were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all transactions.",
      });
    });
};

exports.incomeSumByMonth = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); // Ajustar para incluir exactamente los últimos 6 meses

    const incomeTransactions = await Transaction.findAll({
      where: {
        type: "Ingreso",
        createdAt: {
          [Sequelize.Op.between]: [sixMonthsAgo, now],
        },
      },
    });

    const sumByMonth = {};
    incomeTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthYearKey = `${year}-${month}`;

      if (!sumByMonth[monthYearKey]) {
        sumByMonth[monthYearKey] = 0;
      }

      sumByMonth[monthYearKey] += transaction.amount;
    });

    // Llenar los meses sin transacciones con 0
    const sixMonthsAgoYear = sixMonthsAgo.getFullYear();
    const sixMonthsAgoMonth = sixMonthsAgo.getMonth() + 1;

    for (let i = 0; i < 6; i++) {
      const key = `${sixMonthsAgoYear}-${sixMonthsAgoMonth + i}`;
      if (!(key in sumByMonth)) {
        sumByMonth[key] = 0;
      }
    }

    // Ordenar y recortar a los últimos 6 meses
    const sortedMonths = Object.keys(sumByMonth).sort().slice(-6);
    const result = {};
    sortedMonths.forEach((month) => {
      result[month] = sumByMonth[month];
    });

    res.json(result);
  } catch (error) {
    console.error("Error al obtener la suma de ingresos por mes: ", error);
    res
      .status(500)
      .json({ message: "Error al obtener la suma de ingresos por mes." });
  }
};

exports.expenseSumByMonth = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); // Ajustar para incluir exactamente los últimos 6 meses

    const expenseTransactions = await Transaction.findAll({
      where: {
        type: "Egreso",
        createdAt: {
          [Sequelize.Op.between]: [sixMonthsAgo, now],
        },
      },
    });

    const sumByMonth = {};
    expenseTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthYearKey = `${year}-${month}`;

      if (!sumByMonth[monthYearKey]) {
        sumByMonth[monthYearKey] = 0;
      }

      sumByMonth[monthYearKey] += transaction.amount;
    });

    // Llenar los meses sin transacciones con 0
    const sixMonthsAgoYear = sixMonthsAgo.getFullYear();
    const sixMonthsAgoMonth = sixMonthsAgo.getMonth() + 1;

    for (let i = 0; i < 6; i++) {
      const key = `${sixMonthsAgoYear}-${sixMonthsAgoMonth + i}`;
      if (!(key in sumByMonth)) {
        sumByMonth[key] = 0;
      }
    }

    // Ordenar y recortar a los últimos 6 meses
    const sortedMonths = Object.keys(sumByMonth).sort().slice(-6);
    const result = {};
    sortedMonths.forEach((month) => {
      result[month] = sumByMonth[month];
    });

    res.json(result);
  } catch (error) {
    console.error("Error al obtener la suma de egresos por mes: ", error);
    res
      .status(500)
      .json({ message: "Error al obtener la suma de egresos por mes." });
  }
};

exports.IncomeSumByCategory = async (req, res) => {
  try {
    const incomeSumByCategory = await Transaction.findAll({
      attributes: [
        "categoryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      where: {
        type: "Ingreso", // Filtra solo los ingresos
      },
      group: ["categoryId"],
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    });

    if (incomeSumByCategory.length === 0) {
      return res.status(404).json({ message: "No se encontraron ingresos." });
    }

    res.json(incomeSumByCategory);
  } catch (error) {
    console.error("Error al obtener la suma de ingresos por categoría:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la suma de ingresos por categoría." });
  }
};

exports.ExpenseSumByCategory = async (req, res) => {
  try {
    const incomeSumByCategory = await Transaction.findAll({
      attributes: [
        "categoryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      where: {
        type: "Egreso", // Filtra solo los ingresos
      },
      group: ["categoryId"],
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    });

    if (incomeSumByCategory.length === 0) {
      return res.status(404).json({ message: "No se encontraron ingresos." });
    }

    res.json(incomeSumByCategory);
  } catch (error) {
    console.error("Error al obtener la suma de ingresos por categoría:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la suma de ingresos por categoría." });
  }
};
