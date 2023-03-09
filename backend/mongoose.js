const mongoose = require('mongoose');


const uri = 'mongodb+srv://chessek1ng:tinich18@cluster0.nrwbbdb.mongodb.net/Finanzify';

mongoose.connect( uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(error => console.log(error));

  module.exports = mongoose;