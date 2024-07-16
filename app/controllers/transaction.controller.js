const db = require("../models");
const Transaction = db.transactions;
const Account = db.accounts;
const Category = db.categories;
const User = db.user;
const CurrencyType = db.currencyTypes;
const { validationResult } = require("express-validator");
const { Sequelize, Op, where } = require("sequelize");

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
      const response = user.Accounts.reduce((acc, account) => {
        return acc.concat(account.Transactions);
      }, []);

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
    const {userId} = req.params;
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    const incomeTransactions = await Transaction.findAll({
      where: {
        amount: {
          [Sequelize.Op.gt]: 0,
        },
        createdAt: {
          [Sequelize.Op.between]: [sixMonthsAgo, now],
        },
      },
      include: [
        {
          model: Account,
          where: {userId},
          
        },
      ],
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
      const monthIndex = (sixMonthsAgoMonth + i - 1) % 12 + 1;
      const yearOffset = Math.floor((sixMonthsAgoMonth + i - 1) / 12);
      const key = `${sixMonthsAgoYear + yearOffset}-${monthIndex}`;

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
    const {userId} = req.params;
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    const incomeTransactions = await Transaction.findAll({
      where: {
        amount: {
          [Sequelize.Op.lt]: 0,
        },
        createdAt: {
          [Sequelize.Op.between]: [sixMonthsAgo, now],
        },
      },
      include: [
        {
          model: Account,
          where: {userId},
          
        },
      ],
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
      const monthIndex = (sixMonthsAgoMonth + i - 1) % 12 + 1;
      const yearOffset = Math.floor((sixMonthsAgoMonth + i - 1) / 12);
      const key = `${sixMonthsAgoYear + yearOffset}-${monthIndex}`;

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
    const {userId} = req.params;
    const incomeSumByCategory = await Transaction.findAll({
      attributes: [
        "categoryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      where: {
        amount: {
          [Sequelize.Op.gt]: 0,
        },
      },
      group: ["categoryId"],
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Account,
          where: { userId },
          attributes: [],

        }
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
    const {userId} = req.params;
    const incomeSumByCategory = await Transaction.findAll({
      attributes: [
        "categoryId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      where: {
        amount: {
          [Sequelize.Op.lt]: 0,
        }, // Filtra solo los ingresos
      },
      group: ["categoryId"],
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Account,
          where: { userId },
          attributes: [],

        }
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

// Método para transferir fondos entre cuentas
exports.transfer = async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  
  // Validación inicial de la entrada
  if (!fromAccountId || !toAccountId || !amount) {
    return res.status(400).json({ message: "Datos incompletos para la transferencia." });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "El monto de la transferencia debe ser mayor a cero." });
  }

  try {
    const result = await db.sequelize.transaction(async (t) => {
      // Obtener la cuenta de origen
      const fromAccount = await Account.findByPk(fromAccountId, { transaction: t });
      if (!fromAccount) {
        throw new Error("La cuenta de origen no existe.");
      }

      // Obtener la cuenta de destino
      const toAccount = await Account.findByPk(toAccountId, { transaction: t });
      if (!toAccount) {
        throw new Error("La cuenta de destino no existe.");
      }

      // Verificar que la cuenta de origen tiene suficiente saldo
      if (fromAccount.balance < amount) {
        throw new Error("Saldo insuficiente en la cuenta de origen para la transferencia.");
      }

      // Actualizar el saldo de la cuenta de origen
      fromAccount.balance -= amount;
      await fromAccount.save({ transaction: t });

      // Actualizar el saldo de la cuenta de destino
      toAccount.balance += amount;
      await toAccount.save({ transaction: t });

      // Crear la transacción de salida en la cuenta de origen
      const outgoingTransaction = await Transaction.create({
        amount: -amount,
        accountId: fromAccountId,
        categoryId: null, // Supongamos que es una transferencia sin categoría
        currencyTypeId: fromAccount.currencyTypeId, // Asumimos misma moneda para simplificar
        exchange_rate: 1 // No hay conversión de moneda
      }, { transaction: t });

      // Crear la transacción de entrada en la cuenta de destino
      const incomingTransaction = await Transaction.create({
        amount: amount,
        accountId: toAccountId,
        categoryId: null, // Supongamos que es una transferencia sin categoría
        currencyTypeId: toAccount.currencyTypeId, // Asumimos misma moneda para simplificar
        exchange_rate: 1 // No hay conversión de moneda
      }, { transaction: t });

      return { outgoingTransaction, incomingTransaction };
    });

    // Enviar la respuesta con éxito
    return res.status(200).json({
      message: "Transferencia realizada con éxito",
      transactions: result
    });
  } catch (error) {
    // Manejo de errores y envío de respuesta de error
    return res.status(500).json({
      message: error.message || "Ocurrió un error durante la transferencia."
    });
  }
};