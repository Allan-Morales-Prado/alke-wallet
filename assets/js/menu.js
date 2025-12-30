// Cargar información del usuario
    document.addEventListener('DOMContentLoaded', function() {
      const currentUserEmail = localStorage.getItem('alke_current_user');
      const logoutBtn = document.getElementById('logout-btn');  
      const welcomeMessage = document.getElementById('welcome-message');
      
      if (currentUserEmail) {
        // Extraer el nombre del correo (parte antes del @)
        const userName = currentUserEmail.split('@')[0];
        welcomeMessage.textContent = `Bienvenido(a), ${userName}`;
      } else {
        // Si no hay usuario, mostrar como invitado
        welcomeMessage.textContent = 'Bienvenido(a), Invitado';
      }
      // Configurar el botón de cerrar sesión
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('alke_current_user');
        window.location.href = 'login.html';
      });
    });

// Script para actualizar la cuenta seleccionada
document.getElementById('account').addEventListener('change', function () {
    const accountNumber = this.options[this.selectedIndex].text;
    document.querySelector('#selected-account h3').textContent = `Cuenta ${accountNumber}`;

    // Simular diferentes saldos para cada cuenta (esto es solo demostración)
    const balances = {
        'N°0002311423': '$140.000',
        'N°0002355196': '$75.500',
        'N°0002378830': '$210.750'
    };

    document.querySelector('#selected-account .display-3').textContent = balances[accountNumber];
});
