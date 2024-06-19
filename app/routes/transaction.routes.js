module.exports = app => {
    const transactionController = require("../controllers/transaction.controller.js");
  
    const router = require("express").Router();
  
    // Crear un nuevo transaction
    router.post("/", transactionController.create);
  
    // Obtener todos los transactions
    router.get("/", transactionController.findAll);
  
    // Obtener un transaction por id
    router.get("/:id", transactionController.findOne);
  
    // Actualizar un transaction por id
    router.put("/:id", transactionController.update);
  
    // Eliminar un transaction por id
    router.delete("/:id", transactionController.delete);
  
    // Eliminar todos los transactions
    router.delete("/", transactionController.deleteAll);

    router.get("/sumByMonth", transactionController.sumByMonth);

    router.get("/incomeSumByCategory", transactionController.IncomeSumByCategory);

    router.get("/expenseSumByCategory", transactionController.ExpenseSumByCategory);

    app.use("/api/transactions", router);
  };
  