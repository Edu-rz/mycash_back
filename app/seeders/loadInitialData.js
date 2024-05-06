const db = require("../models");
const Role = db.role;
const Category = db.categories;
const AccountType = db.accountTypes;
const CurrencyType = db.currencyTypes;

async function seedRoles() {
  try {
    Role.create({
      id: 1,
      name: "user",
    });

    Role.create({
      id: 2,
      name: "moderator",
    });

    Role.create({
      id: 3,
      name: "admin",
    });
    console.log("Roles created succesfully.");
  } catch (error) {
    console.log("error on inserting Roles");
  }
}

async function seedCategory() {
  try {
    Category.create({
      id: 1,
      name: "Entrenamiento",
      description: "Gastos en actividades recreativas.",
      icon_name: "nose",
    });

    Category.create({
      id: 2,
      name: "Transporte",
      description: "Gastos en bus, taxi, entre otros.",
      icon_name: "nose",
    });

    console.log("Roles created succesfully.");
  } catch (error) {
    console.log("error on inserting Roles");
  }
}

async function seedAccountType() {
  try {
    AccountType.create({
      id: 1,
      name: "Efectivo",
    });

    console.log("Roles created succesfully.");
  } catch (error) {
    console.log("error on inserting Roles");
  }
}

async function seedCurrencyType() {
  try {
    CurrencyType.create({
      id: 1,
      name: "Dollar",
      short_name: "USD",
      symbol: "$",
      base_exchange_rate: 1,
    });
    CurrencyType.create({
      id: 2,
      name: "Nuevo Sol",
      short_name: "PEN",
      symbol: "S/.",
      base_exchange_rate: 3.7,
    });

    console.log("Roles created succesfully.");
  } catch (error) {
    console.log("error on inserting Roles");
  }
}

const loadInitialData = async () => {
  const seeders = [seedRoles, seedCategory, seedCurrencyType, seedAccountType ];

  for (let seed of seeders) {
    await seed();
  }
};

module.exports = loadInitialData;
