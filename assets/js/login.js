document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('login-form');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                
                // Obtener usuarios de localStorage (compatible con tu index.html)
                const users = JSON.parse(localStorage.getItem('alke_wallet_users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Guardar sesión en localStorage
                    localStorage.setItem('alke_current_user', email);
                    
                    // Redirigir a menu.html
                    window.location.href = 'menu.html';
                } else {
                    alert('Credenciales incorrectas. Verifica tu email y contraseña.');
                }
            });
        });