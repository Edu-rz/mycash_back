const { authJwt } = require("../middlewares");
const { createAccountValidator } = require("../validators/account.validator.js");

module.exports = app => {
    const accountController = require("../controllers/account.controller.js");
  
    const router = require("express").Router();
  
    // Create a new Account
    router.post("/", [authJwt.verifyToken], accountController.create);
    // router.post("/", [authJwt.verifyToken], createAccountValidator, accountController.create);
  
    // Retrieve all my accounts
    router.get("/", [authJwt.verifyToken], accountController.findAll);
  
    // Retrieve a single Account with id
    // router.get("/:id", [authJwt.verifyToken], accountController.findOne);
  
    // // Update a Book with id
    // router.put("/:id", accountController.update);
  
    // // Delete a Book with id
    // router.delete("/:id", accountController.delete);
  
    // // Delete all Books
    // router.delete("/", accountController.deleteAll);
  
    app.use("/api/accounts", router);
  };
  