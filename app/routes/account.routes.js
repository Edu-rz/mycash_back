const { authJwt } = require("../middlewares");
const { createAccountValidator } = require("../validators/account.validator.js");

module.exports = app => {
  const accountController = require("../controllers/account.controller.js");
  const { validateRequest } = require('../middlewares/validateRequest');
  const router = require("express").Router();

  // Create a new Account
  router.post("/", [authJwt.verifyToken, createAccountValidator, validateRequest], accountController.create);

  // Retrieve all my accounts
  router.get("/", [authJwt.verifyToken], accountController.findAll);

  // Delete an account
  router.delete("/:id", [authJwt.verifyToken], accountController.delete);

  // Retrieve a single Account with id
  // router.get("/:id", [authJwt.verifyToken], accountController.findOne);

  // // Update a Book with id
  // router.put("/:id", accountController.update);


  // // Delete all Books
  // router.delete("/", accountController.deleteAll);

  app.use("/api/accounts", router);
};
