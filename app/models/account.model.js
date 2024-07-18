module.exports = (sequelize, Sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account", // Model name
    {
      // Model attributes
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.FLOAT,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      accountTypeId: {
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

  return Account;
};
