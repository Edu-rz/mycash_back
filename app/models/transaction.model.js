module.exports = (sequelize, Sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction", // Model name
    {
      // Model attributes
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      exchange_rate: {
        type: Sequelize.FLOAT,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.INTEGER,
      },
      currencyTypeId: {
        type: Sequelize.INTEGER,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
    }
  );

  Transaction.associate = models => {
    Transaction.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return Transaction;
};
