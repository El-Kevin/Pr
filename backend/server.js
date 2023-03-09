const express = require('express');
const userRouter = require('./routes/userRouter');
const accountRouter = require('./routes/accountRouter');
const profileImageRouter = require('./routes/profileImageRouter');
const app = express();
const mongoose = require('./mongoose');

app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(__dirname + '/public'));


app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/profile-images', profileImageRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
