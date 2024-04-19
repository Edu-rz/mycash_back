module.exports = (sequelize, Sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category", // Model name
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
      description: {
        type: Sequelize.STRING,
      },
      icon_name: {
        type: Sequelize.STRING,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
    }
  );

  return Category;
};
