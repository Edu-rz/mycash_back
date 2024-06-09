const db = require("../models");
const Objective = db.objectives;

// Crear un nuevo Objectivo
exports.create = (req, res) => {
  // Validar la solicitud
  if (!req.body.amount) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!",
    });
    return;
  }

  // Crear un Objectivo
  const objective = {
    amount: req.body.amount,
    start_date: req.body.start_date,
    deadline: req.body.deadline,
    userId: req.body.userId,
    currencyTypeId: req.body.currencyTypeId,
  };

  // Guardar el Objectivo en la base de datos
  Objective.create(objective)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el Objectivo.",
      });
    });
};

// Obtener todos los Objectives
exports.findAll = (req, res) => {
  Objective.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Objectives.",
      });
    });
};

// Obtener un Objective por id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Objective.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se puede encontrar el Objective con id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ocurrió un error al recuperar el Objective con id=" + id,
      });
    });
};

// Actualizar un Objective por id
exports.update = (req, res) => {
  const id = req.params.id;

  Objective.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "El Objective fue actualizado con éxito.",
        });
      } else {
        res.send({
          message: `No se puede actualizar el Objective con id=${id}. Tal vez el Objective no fue encontrado o req.body está vacío!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ocurrió un error al actualizar el Objective con id=" + id,
      });
    });
};

// Eliminar un Objective por id
exports.delete = (req, res) => {
  const id = req.params.id;

  Objective.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "El Objective fue eliminado con éxito!",
        });
      } else {
        res.send({
          message: `No se puede eliminar el Objective con id=${id}. Tal vez el Objective no fue encontrado!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ocurrió un error al eliminar el Objective con id=" + id,
      });
    });
};

// Eliminar todos los Objectives
exports.deleteAll = (req, res) => {
  Objective.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Objectives fueron eliminados con éxito!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los Objectives.",
      });
    });
};
