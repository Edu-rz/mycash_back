const { Transaction } = require('../models'); // Ajusta la ruta según tu estructura de proyecto

// Crear una nueva transacción
exports.create = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las transacciones
exports.findAll = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una transacción por ID
exports.findOne = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una transacción por ID
exports.update = async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedTransaction = await Transaction.findByPk(req.params.id);
      return res.status(200).json(updatedTransaction);
    }
    throw new Error('Transaction not found');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una transacción por ID
exports.delete = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error('Transaction not found');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
