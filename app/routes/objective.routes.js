const { authJwt } = require("../middlewares");

module.exports = app => {
  const objectiveController = require("../controllers/objective.controller");

  const router = require("express").Router();

  // Crear un nuevo Objective
  router.post("/", [authJwt.verifyToken], objectiveController.create);

  // Obtener todos los Objectives
  router.get("/", [authJwt.verifyToken], objectiveController.findAll);

  // Obtener un Objective por id
  router.get("/:id", [authJwt.verifyToken],objectiveController.findOne);

  // Actualizar un Objective por id
  router.put("/:id", [authJwt.verifyToken], objectiveController.update);

  // Eliminar un Objective por id
  router.delete("/:id", [authJwt.verifyToken], objectiveController.delete);

  // Eliminar todos los Objectives
  router.delete("/", [authJwt.verifyToken], objectiveController.deleteAll);

  // Agregar monto a un Objective por id
  router.patch("/:id/monto", [authJwt.verifyToken], objectiveController.agregarMontoObjetivo);

  // Endpoint para retirar monto del objetivo
  app.put('/:id/removeAmount', [authJwt.verifyToken], objectiveController.retirarMontoObjetivo);

  // Ver el progreso de un Objective por id
  router.get("/:id/progreso", [authJwt.verifyToken], objectiveController.verProgreso);

  app.use("/api/objectives", router);
};
