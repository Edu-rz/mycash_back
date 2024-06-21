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
      
      profilePicture: { // Nuevo atributo para la foto de perfil
        type: Sequelize.STRING,
        defaultValue: "", // Puede tener un valor por defecto de cadena vacía
        allowNull: true // Permite nulos en caso de que no se suba una imagen
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
