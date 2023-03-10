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
      res.status(200).json({ existe: true });
    } else {
      res.status(404).json({ existe: false });
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
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('isMatch: ', isMatch);
    if (!isMatch) {
      return res.status(404).send('Usuario o contraseña no encontrado');
    }
    res.status(201).send({
      username: user.username,
      email: user.email,
      // Agrega cualquier otra información que necesites aquí
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

  


// Cambiar contraseña de usuario
router.put('/:username/change-password', async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    const hash = crypto.createHash('sha256');
    console.log('hash: ', hash);
    hash.update(currentPassword);
    console.log('hash: ', hash);
    const currentPasswordInserted = hash.digest('hex');
    console.log('El hash de ', currentPassword, ' es currentPasswordInserted: ', currentPasswordInserted);
    console.log('El hash de ', currentPassword, ' es passwordhash: ', user.password	)
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log('isMatch: ', isMatch);
    if (!isMatch) {
      return res.status(401).send('Contraseña actual incorrecta');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ username }, { password: hashedPassword });
    console.log('Contraseña actualizada exitosamente', hashedPassword);
    res.status(200).send('Contraseña actualizada exitosamente');

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/', (req, res) => {
  res.status(200).json({ message: 'El servidor está funcionando correctamente' });
});

  
// Eliminar usuario
router.delete('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    const hash = crypto.createHash('sha256');
    hash.update(password);
    const passwordHash = hash.digest('hex');
    const isMatch = await bcrypt.compare(password, user.password);

    console.log(passwordHash);
    console.log('isMatch in deleteUser: ', isMatch);
    console.log('username:', user);
    if (!isMatch) {
      return res  .status(401).send('Contraseña incorrecta');
    }

    await User.findOneAndDelete({ username });
    res.status(200).send('Usuario eliminado exitosamente');

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Crear usuario
router.post('/create', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Comprobar si ya existe un usuario con el mismo nombre de usuario o correo electrónico
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).send('Ya existe un usuario con el mismo nombre de usuario o correo electrónico');
    }

    // Crear un nuevo usuario con la información proporcionada por el cliente
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Guardar el usuario recién creado en la base de datos
    await newUser.save();

    res.status(201).send({
      username: newUser.username,
      email: newUser.email,
      // Agrega cualquier otra información que necesites aquí
    });    
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});









module.exports = router;
