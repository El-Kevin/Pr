async function crearUsuario() {
  const username = document.getElementById('usernameCU').value;
  const password = document.getElementById('passwordCU').value;
  const verifyPassword = document.getElementById('verifyPasswordCU').value;
  const email = document.getElementById('emailCU').value;
  if (password !== verifyPassword) {
    return alert('Las contraseñas no coinciden');
  }

  const resultadoCU = document.getElementById('resultadoCU');
  const respuesta = await fetch(`http://localhost:3000/api/users/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email })
  });

  const usuario = await respuesta.json();

  // Redirige al usuario a la página de dashboard con el objeto de usuario que acabamos de crear
  window.location.href = `dashboard.html?username=${usuario.username}&email=${usuario.email}`;
}
