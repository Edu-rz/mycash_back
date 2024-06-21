const db = require("../models");
const User = db.user;
const multer = require('multer');
const path = require('path');

// Configurar multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, req.userId + path.extname(file.originalname)); // Nombre del archivo será el ID del usuario
  }
});

const upload = multer({ storage: storage });

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.uploadProfilePicture = [
  upload.single('profile_picture'),
  (req, res) => {
    User.findByPk(req.userId)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "Usuario no encontrado." });
        }

        user.profile_picture = `/uploads/${req.file.filename}`;
        return user.save();
      })
      .then(updatedUser => {
        res.send({ message: "Foto de perfil actualizada con éxito.", user: updatedUser });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  }
];