const { authJwt } = require("../middlewares");

module.exports = app => {
    const currencyTypeController = require("../controllers/currencyType.controller");
  
    const router = require("express").Router();
  
    // Retrieve all my accounts
    router.get("/", currencyTypeController.findAll);

    // Create a new Account
    // router.post("/", [authJwt.verifyToken], accountController.create);
  
    // Delete an account
    // router.delete("/:id", [authJwt.verifyToken], accountController.delete);

    // Retrieve a single Account with id
    // router.get("/:id", [authJwt.verifyToken], accountController.findOne);
  
    // // Update a Book with id
    // router.put("/:id", accountController.update);
  
  
    // // Delete all Books
    // router.delete("/", accountController.deleteAll);
  
    app.use("/api/currencyType", router);
  };
  