async function autenticarUsuario() {
    const username = document.getElementById('usernameAU').value;
    const password = document.getElementById('passwordAU').value;
    
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const usuario = await response.json();
    // Redirige al usuario a la página de dashboard con el objeto de usuario que acabamos de crear
    window.location.href = `dashboard.html?username=${usuario.username}&email=${usuario.email}`;
  }
  

