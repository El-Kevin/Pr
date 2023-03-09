const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/users/login', {
      username: 'ejemploUsuario',
      password: 'ejemploContraseña'
    });
    console.log(response.data.token);
  } catch (error) {
    console.error(error);
  }
}

testLogin();

