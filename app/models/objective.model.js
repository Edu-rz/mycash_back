//objetive.model.js
module.exports = (sequelize, Sequelize, DataTypes) => {
  const Objective = sequelize.define(
    "Objective", // Model name
    {
      // Model attributes
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      deadline: {
        type: Sequelize.DATE,
      },
      userId: {
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

  return Objective;
};