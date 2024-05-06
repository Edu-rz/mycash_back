const { body } = require("express-validator");

const createAccountValidator = [
  body("user.name", "name does not Empty").not().isEmpty(),
  body("user.balance", "username must be numeric").isNumeric().not().isEmpty(),
  body("user.currencyTypeId", "currencyTypeId must be numeric")
    .isNumeric()
    .not()
    .isEmpty(),
  body("user.accountTypeId", "accountTypeId must be numeric")
    .isNumeric()
    .not()
    .isEmpty(),
];

module.exports = createAccountValidator