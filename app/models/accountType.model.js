module.exports = (sequelize, Sequelize, DataTypes) => {
  const AccountType = sequelize.define(
    "AccountType", // Model name
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
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
    }
  );

  return AccountType;
};
