document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
  
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        // datos que escribe el usuario en HTML
        const txtUsuario = document.getElementById('usuario').value.trim();
        const selectRol = document.getElementById('rol').value; // 'admin' o 'vendedor'
        const txtEmail = document.getElementById('email').value.trim();
        const txtPassword = document.getElementById('password').value;
  
        // Usuario por defecto (A eliminar)
        const defUsuarios = [{ 
          id: 1, 
          nombre: 'admin', 
          rol: 'Administrador', 
          mail: 'admin@veloura.com', 
          contraseña: '1234' 
        }];
        
        // Se revisa la tabla de usuarios
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || defUsuarios;
  
        // Verifica si hay un usuario con lo que ingreso el usuario
        const usuarioValido = usuarios.find(u => 
          u.nombre.toLowerCase() === txtUsuario.toLowerCase() &&
          u.mail.toLowerCase() === txtEmail.toLowerCase() &&
          u.contraseña === txtPassword &&
          u.rol.toLowerCase().includes(selectRol)
        );
  
        // Si es correcto se redirige a su respectiva pantalla
        if (usuarioValido) {
          alert(`¡Bienvenido de nuevo, ${usuarioValido.nombre}!`);
          
          // Se guarda el usuario logueado
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
  
          
          if (selectRol === 'admin') {
            window.location.href = 'index3.html';  
          } else if (selectRol === 'vendedor') {
            window.location.href = 'index2.html'; 
          }
  
        } else {
          alert('Datos incorrectos. Revisá el usuario, rol, mail y contraseña.');
        }
      });
    }
  });