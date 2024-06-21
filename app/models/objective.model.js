// Objective.model,js

module.exports = (sequelize, DataTypes) => {
  const Objective = sequelize.define(
    "Objective",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      objective_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      current_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      target_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      icon_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      currencyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'CurrencyTypes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  Objective.associate = (models) => {
    Objective.belongsTo(models.User, { foreignKey: 'userId' });
    Objective.belongsTo(models.CurrencyType, { foreignKey: 'currencyTypeId' });
  };

  return Objective;
};
