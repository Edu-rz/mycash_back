//objetive.controller.js
const { where } = require("sequelize");
const db = require("../models");
const Objective = db.objectives;

// (1) Crear un nuevo Objetivo
exports.create = async (req, res) => {
  // user Id
  const userId = req.userId;

  // Crear un Objetivo
  const objective = {
    objective_name: req.body.objective_name,
    current_amount: req.body.current_amount || 0,
    target_amount: req.body.target_amount,
    icon_name: req.body.icon_name,
    color_name: req.body.color_name,
    deadline: req.body.deadline,
    userId: userId,
  };

    // Validar la solicitud
  if (!req.body.target_amount) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!",
    });
    return;
  }

  // Guardar el Objetivo en la base de datos
  const result = await Objective.create(objective);

  return res.status(200).json({
    message: "El objetivo se creó exitosamente",
    result: result,
  });
};

// (2) Obtener todos los Objetivos del Usuario
exports.findAll = (req, res) => {
  const userId = req.userId; // Utiliza req.userId

  Objective.findAll({
    where: { userId: userId },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `Ocurrió un error al recuperar los Objetivos del usuario ${userId}.`,
      });
    });
};

// (3) Obtener un Objetivo por id del Usuario
exports.findOne = (req, res) => {
  const userId = req.userId; // Utiliza req.userId
  const id = req.params.id; // ID del objetivo

  Objective.findOne({
    where: {
      id: id,
      userId: userId
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se puede encontrar el Objetivo con id=${id} para el usuario con id=${userId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al recuperar el Objetivo con id=${id} para el usuario con id=${userId}.`,
      });
    });
};

// (4) Actualizar un Objetivo por id del Usuario
exports.update = (req, res) => {
  const userId = req.userId; // Utiliza req.userId
  const id = req.params.id; // ID del objetivo a actualizar

  // Restringir los campos que pueden ser actualizados
  const allowedFields = {
    objective_name: req.body.objective_name,
    target_amount: req.body.target_amount,
    icon_name: req.body.icon_name,
    color_name: req.body.color_name,
    deadline: req.body.deadline,
  };

  // Buscar el objetivo en la base de datos
  Objective.findOne({
    where: {
      id: id,
      userId: userId
    },
  })
    .then((objective) => {
      if (!objective) {
        return res.status(404).send({
          message: `No se puede encontrar el Objetivo con id=${id} para el usuario con id=${userId}.`,
        });
      }

      // Actualizar el objetivo con los campos permitidos
      return objective.update(allowedFields);
    })
    .then((updatedObjective) => {
      res.status(200).send(updatedObjective);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al actualizar el Objetivo con id=${id} para el usuario con id=${userId}.`,
        error: err.message,
      });
    });
};


// (5) Eliminar un Objetivo por id del Usuario
exports.delete = async (req, res) => {
  try {
    // user Id
    const userId = req.userId;
    const id = req.params.id;

    const objective = await Objective.findOne({
      where: { id: id, userId: userId },
    });

    if (!objective) {
      return res.status(404).send({
        message: `No se puede eliminar el Objetivo con id=${id} para el usuario con id=${userId}. Tal vez el Objetivo no fue encontrado!`,
      });
    }

    await Objective.destroy({
      where: { id: id },
    });

    res.send({
      message: "El Objetivo fue eliminado con éxito!",
    });
  } catch (err) {
    res.status(500).send({
      message: "No se puede eliminar el Objetivo con id=" + id,
    });
  }
};

// (6) Eliminar todos los Objetivos del Usuario
exports.deleteAll = (req, res) => {
  const userId = req.userId; // Utiliza req.userId

  Objective.destroy({
    where: { userId: userId },
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Objetivos fueron eliminados con éxito para el usuario con id=${userId}!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al eliminar todos los Objetivos para el usuario con id=${userId}.`,
        error: err.message
      });
    });
};

// (7) Agregar monto al objetivo del Usuario
exports.agregarMontoObjetivo = (req, res) => {
  const userId = req.userId; // Utiliza req.userId
  const { id } = req.params; // ID del objetivo
  const { monto } = req.body; // Monto a agregar al objetivo

  Objective.findByPk(id)
    .then((objective) => {
      if (!objective) {
        return res.status(404).send({
          message: `No se puede encontrar el Objetivo con id=${id} para el usuario con id=${userId}.`,
        });
      }

      // Verificar que el objetivo pertenece al usuario antes de actualizar
      if (objective.userId !== userId) {
        return res.status(403).send({
          message: `No tienes permisos para modificar el Objetivo con id=${id}.`,
        });
      }

      // Calcular el nuevo valor del current_amount después de agregar el monto
      const newCurrentAmount = objective.current_amount + monto;

      // Verificar si el nuevo current_amount supera el target_amount
      if (newCurrentAmount > objective.target_amount) {
        return res.status(400).send({
          message: `No puedes superar el monto objetivo de ${objective.target_amount}.`,
        });
      }

      // Actualizar el monto del objetivo
      objective.current_amount = newCurrentAmount;
      return objective.save();
    })
    .then((updatedObjective) => {
      res.send(updatedObjective);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al agregar monto al objetivo con id=${id} para el usuario con id=${userId}.`,
        error: err.message,
      });
    });
};

// (8) Retirar monto del objetivo del Usuario
exports.retirarMontoObjetivo = (req, res) => {
  const userId = req.userId; // Utiliza req.userId
  const { id } = req.params; // ID del objetivo
  const { monto } = req.body; // Monto a retirar del objetivo

  Objective.findByPk(id)
    .then((objective) => {
      if (!objective) {
        return res.status(404).send({
          message: `No se puede encontrar el Objetivo con id=${id} para el usuario con id=${userId}.`,
        });
      }

      // Verificar que el objetivo pertenece al usuario antes de actualizar
      if (objective.userId !== userId) {
        return res.status(403).send({
          message: `No tienes permisos para modificar el Objetivo con id=${id}.`,
        });
      }

      // Calcular el nuevo valor del current_amount después de retirar el monto
      const newCurrentAmount = objective.current_amount - monto;

      // Verificar si el nuevo current_amount es menor que 0
      if (newCurrentAmount < 0) {
        return res.status(400).send({
          message: `El monto ahorrado no puede ser negativo.`,
        });
      }

      // Actualizar el monto del objetivo
      objective.current_amount = newCurrentAmount;
      return objective.save();
    })
    .then((updatedObjective) => {
      res.send(updatedObjective);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al retirar monto del objetivo con id=${id} para el usuario con id=${userId}.`,
        error: err.message,
      });
    });
};

// (9) Ver el progreso de un objetivo del Usuario
exports.verProgreso = (req, res) => {
  const userId = req.userId; // Utiliza req.userId
  const { id } = req.params; // ID del objetivo

  Objective.findByPk(id)
    .then((objective) => {
      if (!objective) {
        return res.status(404).send({
          message: `No se puede encontrar el Objetivo con id=${id} para el usuario con id=${userId}.`,
        });
      }

      // Verificar que el objetivo pertenece al usuario antes de calcular el progreso
      if (objective.userId !== userId) {
        return res.status(403).send({
          message: `No tienes permisos para ver el progreso del Objetivo con id=${id}.`,
        });
      }

      const progreso = (objective.current_amount / objective.target_amount) * 100;
      res.send({ progreso: `${progreso}%` });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al ver progreso del objetivo con id=${id} para el usuario con id=${userId}.`,
        error: err.message,
      });
    });
};
