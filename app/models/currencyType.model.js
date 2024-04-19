module.exports = (sequelize, Sequelize, DataTypes) => {
  const CurrencyType = sequelize.define(
    "CurrencyType", // Model name
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
      short_name: {
        type: Sequelize.STRING,
      },
      symbol: {
        type: Sequelize.STRING,
      },
      base_exchange_rate: {
        type: Sequelize.FLOAT,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
    }
  );

  return CurrencyType;
};
