document.addEventListener('DOMContentLoaded', function() {
      const registerForm = document.getElementById('register-form');
      const alertContainer = document.getElementById('alert-container');
      const submitBtn = document.getElementById('submit-btn');
      
      // Llave para almacenar en LocalStorage
      const STORAGE_KEY = 'alke_wallet_users';
      
      // Función para mostrar alertas
      function showAlert(message, type = 'danger') {
        alertContainer.innerHTML = `
          <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        `;
      }
      
      // Función para validar email
      function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
      
      // Función para verificar si el usuario ya existe
      function userExists(email) {
        const users = getUsers();
        return users.some(user => user.email === email);
      }
      
      // Función para obtener todos los usuarios
      function getUsers() {
        const usersJson = localStorage.getItem(STORAGE_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
      }
      
      // Función para guardar usuario
      function saveUser(email, password) {
        const users = getUsers();
        const newUser = {
          email: email,
          password: password, // En producción, esto debería estar encriptado
          createdAt: new Date().toISOString(),
          balance: 0, // Saldo inicial
          transactions: [] // Historial de transacciones vacío
        };
        
        users.push(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        
        // Guardar sesión actual
        localStorage.setItem('alke_current_user', email);
        sessionStorage.setItem('alke_session', 'active');
        
        return newUser;
      }
      
      // Validación en tiempo real
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirm-password');
      
      emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
          this.classList.add('is-invalid');
        } else {
          this.classList.remove('is-invalid');
        }
      });
      
      passwordInput.addEventListener('input', function() {
        if (this.value.length < 6 && this.value.length > 0) {
          this.classList.add('is-invalid');
        } else {
          this.classList.remove('is-invalid');
        }
      });
      
      confirmPasswordInput.addEventListener('input', function() {
        if (this.value !== passwordInput.value) {
          this.classList.add('is-invalid');
        } else {
          this.classList.remove('is-invalid');
        }
      });
      
      // Manejo del envío del formulario
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Resetear estados
        registerForm.querySelectorAll('.is-invalid').forEach(el => {
          el.classList.remove('is-invalid');
        });
        
        // Obtener valores
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validaciones
        let isValid = true;
        
        if (!email || !isValidEmail(email)) {
          emailInput.classList.add('is-invalid');
          isValid = false;
        }
        
        if (!password || password.length < 6) {
          passwordInput.classList.add('is-invalid');
          isValid = false;
        }
        
        if (password !== confirmPassword) {
          confirmPasswordInput.classList.add('is-invalid');
          isValid = false;
        }
        
        if (!isValid) {
          showAlert('Por favor, corrige los errores en el formulario.');
          return;
        }
        
        // Verificar si el usuario ya existe
        if (userExists(email)) {
          emailInput.classList.add('is-invalid');
          showAlert('Este correo electrónico ya está registrado.');
          return;
        }
        
        // Deshabilitar botón durante el proceso
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Creando cuenta...';
        
        // Simular proceso de registro (en un caso real, aquí iría una petición al servidor)
        setTimeout(() => {
          try {
            // Guardar usuario
            const user = saveUser(email, password);
            
            // Mostrar mensaje de éxito
            showAlert(`¡Cuenta creada exitosamente! Bienvenido/a ${email}. Serás redirigido a tu dashboard.`, 'success');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
              window.location.href = 'menu.html'; // Página a crear después
            }, 2000);
            
          } catch (error) {
            console.error('Error al guardar usuario:', error);
            showAlert('Ocurrió un error al crear la cuenta. Por favor, intenta nuevamente.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Crear Cuenta';
          }
        }, 1000); // Simular delay de red
      });
      
      // Opcional: Mostrar usuarios registrados (para desarrollo)
      console.log('Usuarios registrados:', getUsers());
    });