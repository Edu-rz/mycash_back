const { authJwt } = require("../middlewares");

module.exports = app => {
    const transactionController = require("../controllers/transaction.controller.js");
  
    const router = require("express").Router();
  
    // Crear un nuevo transaction
    router.post("/", transactionController.create);
  
    // Obtener todos los transactions
    router.get("/", [authJwt.verifyToken], transactionController.findAll);
  
    // Obtener un transaction por id
    router.get("/:id", transactionController.findOne);
  
    // Actualizar un transaction por id
    router.put("/:id", transactionController.update);
  
    // Eliminar un transaction por id
    router.delete("/:id", transactionController.delete);
  
    // Eliminar todos los transactions
    router.delete("/", transactionController.deleteAll);

    router.get("/incomeSum/ByMonth/:userId", transactionController.incomeSumByMonth);
    router.get("/expenseSum/ByMonth/:userId", transactionController.expenseSumByMonth);


    router.get("/incomeSum/ByCategory/:userId", transactionController.IncomeSumByCategory);

    router.get("/expenseSum/ByCategory/:userId", transactionController.ExpenseSumByCategory);

    app.post("/api/transfer/waza", transactionController.transfer);

    app.use("/api/transactions", router);

  };
  