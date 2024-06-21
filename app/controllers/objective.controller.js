const { where } = require("sequelize");
const db = require("../models");
const Objective = db.objectives;
const CurrencyType = db.currencyTypes;

// (1) Crear un nuevo Objetivo
exports.create = (req, res) => {
  // Validar la solicitud
  if (!req.body.target_amount) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!",
    });
    return;
  }

  // Crear un Objetivo
  const objective = {
    objective_name: req.body.objective_name,
    current_amount: req.body.current_amount || 0,
    target_amount: req.body.target_amount,
    icon_name: req.body.icon_name,
    color_name: req.body.color_name,
    start_date: req.body.start_date,
    deadline: req.body.deadline,
    userId: req.userId, // Asegúrate de utilizar req.userId
    currencyTypeId: req.body.currencyTypeId,
  };

  // Guardar el Objetivo en la base de datos
  Objective.create(objective)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el Objetivo.",
      });
    });
};

// (2) Obtener todos los Objetivos del Usuario
exports.findAll = (req, res) => {
  const userId = req.userId; // Utiliza req.userId

  Objective.findAll({
    where: { userId: userId },
    include: [{model: CurrencyType}]
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
    }
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
    start_date: req.body.start_date,
    deadline: req.body.deadline,
    currencyTypeId: req.body.currencyTypeId,
  };

  // Buscar el objetivo en la base de datos
  Objective.findOne({
    where: {
      id: id,
      userId: userId
    }
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
exports.delete = (req, res) => {
  const userId = req.userId; // Utiliza req.userId
  const id = req.params.id; // ID del objetivo a eliminar

  Objective.destroy({
    where: { 
      id: id,
      userId: userId 
    }
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "El Objetivo fue eliminado con éxito!",
        });
      } else {
        res.status(404).send({
          message: `No se puede eliminar el Objetivo con id=${id} para el usuario con id=${userId}. Tal vez el Objetivo no fue encontrado!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Ocurrió un error al eliminar el Objetivo con id=${id} para el usuario con id=${userId}.`,
      });
    });
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

// (8) Ver el progreso de un objetivo del Usuario
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
