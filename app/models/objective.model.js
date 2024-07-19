// Objective.model.js

module.exports = (sequelize, Sequelize, DataTypes) => {
  const Objective = sequelize.define(
    "Objective",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      objective_name: {
        type: Sequelize.STRING,
      },
      current_amount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      target_amount: {
        type: Sequelize.FLOAT,
        validate: {
          min: 0,
        },
      },
      icon_name: {
        type: Sequelize.STRING,
      },
      color_name: {
        type: Sequelize.STRING,
      },
      deadline: {
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  return Objective;
};
