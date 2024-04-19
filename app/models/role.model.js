module.exports = (sequelize, Sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
    }
  );

  return Role;
};
