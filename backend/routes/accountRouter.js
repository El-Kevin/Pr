const express = require('express');
const Cuenta = require('../models/accounts');
const router = express.Router();

// Obtener todas las cuentas de un usuario
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cuentas = await Cuenta.find({ username });
    res.status(200).json(cuentas);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Insertar una nueva cuenta para un usuario
router.post('/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const { name, value, type, month, year } = req.body;
  
      // Verificar que la cuenta sea única para el usuario
      const cuentaExistente = await Cuenta.findOne({ username, name });
      if (cuentaExistente) {
        return res.status(400).send('Ya existe una cuenta con ese nombre');
      }
  
      // Insertar la nueva cuenta en la base de datos
      const nuevaCuenta = new Cuenta({ username, name, value, type, month, year });
      await nuevaCuenta.save();
  
      res.status(201).json(nuevaCuenta);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.delete('/:username/accounts/:accountId', async (req, res) => {
    try {
      const { username, accountId } = req.params;
      const account = await Account.findOne({ _id: accountId, username });
      if (!account) {
        res.status(404).send('Account not found');
      } else {
        await account.remove();
        res.status(200).send('Account deleted successfully');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
//Actualizar una cuenta
  router.put('/:username/accounts/:accountId', async (req, res) => {
    try {
      const { username, accountId } = req.params;
      const updatedAccount = req.body;
      const account = await Account.findOneAndUpdate({ _id: accountId, username }, updatedAccount, { new: true });
      if (!account) {
        res.status(404).send('Account not found');
      } else {
        res.status(200).send(account);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  


module.exports = router;
