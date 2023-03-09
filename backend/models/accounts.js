const mongoose = require('mongoose');
const { Schema } = mongoose;

const cuentaSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  }
}, { collection: 'accounts'});

const Cuenta = mongoose.model('Cuenta', cuentaSchema);

module.exports = Cuenta;