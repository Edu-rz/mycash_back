module.exports = (sequelize, Sequelize, DataTypes) => {
  const User = sequelize.define(
    "User", // Model name
    {
      // Attributes
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: Sequelize.UUIDV4,
      //   primaryKey: true,
      // },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      profile_picture: {
        type: DataTypes.STRING, // Usaremos una cadena para almacenar la URL o ruta de la imagen
        allowNull: true,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
    }
  );

  return User;
};