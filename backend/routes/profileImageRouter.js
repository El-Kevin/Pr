
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const Usuario = require('../models/users');

const router = express.Router();

// Configuración de Multer para subir archivos
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, req.params.nombre + path.extname(file.originalname));
    }
  })
});

// Ruta para subir la imagen de perfil
router.post('/perfil/imagen/:nombre', upload.single('imagen'), (req, res) => {
  // Actualizar el campo de imagen en la base de datos
  Usuario.updateOne({ nombre: req.params.nombre }, { imagen: req.file.filename }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al actualizar la imagen de perfil');
    } else {
      res.send('Imagen de perfil subida correctamente');
    }
  });
});

// Ruta para actualizar la imagen de perfil
router.put('/perfil/imagen/:nombre', upload.single('imagen'), (req, res) => {
  // Eliminar la imagen anterior
  Usuario.findOne({ nombre: req.params.nombre }, (err, usuario) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al actualizar la imagen de perfil');
    } else if (usuario) {
      const rutaImagenAnterior = path.join('uploads', usuario.imagen);
      fs.unlink(rutaImagenAnterior, (err) => {
        if (err) {
          console.error(err);
        }
        // Actualizar el campo de imagen en la base de datos
        Usuario.updateOne({ nombre: req.params.nombre }, { imagen: req.file.filename }, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al actualizar la imagen de perfil');
          } else {
            res.send('Imagen de perfil actualizada correctamente');
          }
        });
      });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });
});

// Ruta para obtener la imagen de perfil
router.get('/perfil/imagen/:nombre', (req, res) => {
  Usuario.findOne({ nombre: req.params.nombre }, (err, usuario) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener la imagen de perfil');
    } else if (usuario && usuario.imagen) {
      const rutaImagen = path.join('uploads', usuario.imagen);
      res.sendFile(rutaImagen);
    } else {
      res.status(404).send('Usuario no encontrado o sin imagen de perfil');
    }
  });
});

// Ruta para eliminar la imagen de perfil
router.delete('/perfil/imagen/:nombre', (req, res) => {
    Usuario.findOne({ nombre: req.params.nombre }, (err, usuario) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al eliminar la imagen de perfil');
      } else if (usuario && usuario.imagen) {
        const rutaImagen = path.join('uploads', usuario.imagen);
        fs.unlink(rutaImagen, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al eliminar la imagen de perfil');
          } else {
            // Actualizar el campo de imagen en la base de datos
            Usuario.updateOne({ nombre: req.params.nombre }, { imagen: null }, (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error al eliminar la imagen de perfil');
              } else {
                res.send('Imagen de perfil eliminada correctamente');
              }
            });
          }
        });
      } else {
        res.status(404).send('Usuario no encontrado o sin imagen de perfil');
      }
    });
  });
  
 module.exports = router;