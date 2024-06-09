const db = require("../models");
const Objective = db.objectives;

// Crear un nuevo Objetivo
exports.create = (req, res) => {
  // Validar la solicitud
  if (!req.body.amount) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!",
    });
    return;
  }

  // Crear un Objetivo
  const objective = {
    amount: req.body.amount,
    start_date: req.body.start_date,
    deadline: req.body.deadline,
    userId: req.body.userId,
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

// Obtener todos los Objetivo
exports.findAll = (req, res) => {
  Objective.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Objetivos.",
      });
    });
};

// Obtener un Objetivo por id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Objective.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se puede encontrar el Objetivo con id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ocurrió un error al recuperar el Objetivo con id=" + id,
      });
    });
};

// Actualizar un Objetivo por id
exports.update = (req, res) => {
  const id = req.params.id;

  Objective.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "El Objetivo fue actualizado con éxito.",
        });
      } else {
        res.send({
          message: `No se puede actualizar el Objetivo con id=${id}. Tal vez el Objetivo no fue encontrado o req.body está vacío!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ocurrió un error al actualizar el Objetivo con id=" + id,
      });
    });
};

// Eliminar un Objetivo por id
exports.delete = (req, res) => {
  const id = req.params.id;

  Objective.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "El Objetivo fue eliminado con éxito!",
        });
      } else {
        res.send({
          message: `No se puede eliminar el Objetivo con id=${id}. Tal vez el Objetivo no fue encontrado!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ocurrió un error al eliminar el Objetivo con id=" + id,
      });
    });
};

// Eliminar todos los Objetivos
exports.deleteAll = (req, res) => {
  Objective.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Objetivos fueron eliminados con éxito!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los Objetivos.",
      });
    });
};
