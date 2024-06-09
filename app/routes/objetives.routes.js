module.exports = app => {
  const objectiveController = require("../controllers/objective.controller.js");

  const router = require("express").Router();

  // Crear un nuevo Objective
  router.post("/", objectiveController.create);

  // Obtener todos los Objectives
  router.get("/", objectiveController.findAll);

  // Obtener un Objective por id
  router.get("/:id", objectiveController.findOne);

  // Actualizar un Objective por id
  router.put("/:id", objectiveController.update);

  // Eliminar un Objective por id
  router.delete("/:id", objectiveController.delete);

  // Eliminar todos los Objectives
  router.delete("/", objectiveController.deleteAll);

  app.use("/api/objectives", router);
};
