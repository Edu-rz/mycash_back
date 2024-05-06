const config = require("../config/config.js");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    operatorsAliases: false,

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;


// MODELS
db.books = require("./book.model.js")(sequelize, Sequelize, DataTypes);
db.user = require("./user.model.js")(sequelize, Sequelize, DataTypes);
db.role = require("./role.model.js")(sequelize, Sequelize, DataTypes);

// db.accountTypes = require("./accountType.model.js")(sequelize, Sequelize, DataTypes);
db.categories = require("./category.model.js")(sequelize, Sequelize, DataTypes);
db.currencyTypes = require("./currencyType.model.js")(sequelize, Sequelize, DataTypes);
db.objectives = require("./objective.model.js")(sequelize, Sequelize, DataTypes);
db.accounts = require("./account.model.js")(sequelize, Sequelize, DataTypes);
db.transactions = require("./transaction.model.js")(sequelize, Sequelize, DataTypes);


// ASSOCIATIONS
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id"
});

// db.accountTypes.hasMany(db.accounts, {
//   foreignKey: "accountTypeId",
// });

db.user.hasMany(db.accounts, {
  foreignKey: "userId"
})

db.currencyTypes.hasMany(db.accounts, {
  foreignKey: "currencyTypeId",
});

db.categories.hasMany(db.objectives, {
  foreignKey: "categoryId",
});

db.currencyTypes.hasMany(db.objectives, {
  foreignKey: "currencyTypeId",
});

db.user.hasMany(db.objectives, {
  foreignKey: 'userId'
})

db.currencyTypes.hasMany(db.transactions, {
  foreignKey: "currencyTypeId",
});

db.categories.hasMany(db.transactions, {
  foreignKey: "categoryId",
});

db.accounts.hasMany(db.transactions, {
  foreignKey: 'accountId'
})


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
