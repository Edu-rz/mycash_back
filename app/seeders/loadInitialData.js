const db = require("../models");
const Role = db.role;
const Category = db.categories;
const AccountType = db.accountTypes;
const CurrencyType = db.currencyTypes;
const Account = db.accounts;

async function seedRoles() {
  try {
    Role.upsert({
      id: 1,
      name: "user",
    });

    Role.upsert({
      id: 2,
      name: "moderator",
    });

    Role.upsert({
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
    Category.upsert({
      id: 1,
      name: "Entrenamiento",
      description: "Gastos en actividades recreativas.",
      icon_name: "nose",
    });

    Category.upsert({
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
    AccountType.upsert({
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
    CurrencyType.upsert({
      id: 1,
      name: "Dolar",
      short_name: "USD",
      symbol: "$",
      base_exchange_rate: 1,
    });
    CurrencyType.upsert({
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
  const seeders = [seedRoles, seedCategory, seedCurrencyType, seedAccountType];

  for (let seed of seeders) {
    await seed();
  }
};

module.exports = loadInitialData;
