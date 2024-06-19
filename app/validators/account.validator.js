const { body } = require('express-validator');

exports.createAccountValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
  body('balance')
    .notEmpty().withMessage('Balance is required')
    .isFloat({ min: 0 }).withMessage('Balance must be a positive number'),
  body('currencyTypeId')
    .notEmpty().withMessage('Currency Type ID is required')
    .isInt({ min: 1 }).withMessage('Currency Type ID must be an integer and be greater than 0'),
];
