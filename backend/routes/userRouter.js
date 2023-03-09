const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Consultar existencia de usuario
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).send(true);
    } else {
      res.status(404).send(false);
    }
  } catch (error) {
    console.log('El error se produjo aqui');
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Autenticar usuario y brindar token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('Usuario o contraseña no encontrado');
    }
    const hash = crypto.createHash('sha256');
    console.log('hash: ', hash);
    hash.update(password);
    console.log('hash: ', hash);
    const passwordHash = hash.digest('hex');
    console.log('El hash de ', password, ' es  passwordhash: ', passwordHash);
    console.log('El hash de ', password, ' es  passwordhash: ', user.password	)
    const isMatch = passwordHash === user.password;
    console.log('isMatch: ', isMatch);
    if (!isMatch) {
      return res.status(404).send('Usuario o contraseña no encontrado');
    }

    res.status(200).send('Usuyario valido');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

  


  // Cambiar contraseña de usuario
router.put('/:userId/change-password', async (req, res) => {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).send('Contraseña actual incorrecta');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      res.status(200).send('Contraseña actualizada exitosamente');
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/', (req, res) => {
    res.status(200).json({ message: 'El servidor está funcionando correctamente' });
  });
  


module.exports = router;
