module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,

  /** DATABASE */
  db: {
    DB_HOST: process.env.DB_HOST || "127.0.0.1",
    DB_USER: process.env.DB_USER || "root",
    DB_PASS: process.env.DB_PASS || "1234",
    DB_NAME: process.env.DB_NAME || "mycash_db",
    dialect: "mysql",

    // pool is optional, it will be used for Sequelize connection pool configuration
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  /** AUTH KEY */
  auth: {
    secret: "our-secret-key"
  }
};
