module.exports = (app) => {
  const categoryController = require("../controllers/category.controller");

  const router = require("express").Router();

  // Crear una nueva categoría
  router.post("/", categoryController.createCategory);

  // Obtener todas las categorías
  router.get("/", categoryController.getAllCategories);

  // Obtener una categoría por su ID
  router.get("/:id", categoryController.getCategoryById);

  // Actualizar una categoría por su ID
  router.put("/:id", categoryController.updateCategory);

  // Eliminar una categoría por su ID
  router.delete("/:id", categoryController.deleteCategory);

  app.use("/api/categories", router);
};
