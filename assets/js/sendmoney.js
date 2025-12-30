// Definir balances iniciales
    let balances = {
        'N°0002311423': 140000,
        'N°0002355196': 75500,
        'N°0002378830': 210750
    };
    
    // Cargar balances desde localStorage si existen
    const savedBalances = localStorage.getItem('alke_wallet_balances');
    if (savedBalances) {
        balances = JSON.parse(savedBalances);
    }
    
    // Función para formatear el saldo como moneda
    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('es-CL');
    }
    
    // Función para actualizar el saldo mostrado
    function updateBalanceDisplay() {
        const accountSelect = document.getElementById('from-account');
        const accountNumber = accountSelect.options[accountSelect.selectedIndex].text;
        const balance = balances[accountNumber] || 0;
        document.querySelector('#available-balance span').textContent = formatCurrency(balance);
    }
    
    // Cargar contactos desde localStorage o usar los predeterminados
    function loadContacts() {
        const savedContacts = localStorage.getItem('alke_wallet_contacts');
        if (savedContacts) {
            return JSON.parse(savedContacts);
        }
        return [
            {name: 'Ismail Al-Kanabawi', rut: '33.121.311-0', account: '0023333121311'},
            {name: 'Khidir Karawita', rut: '33.098.711-k', account: '0023333098711'},
            {name: 'John Doe', rut: '18.332.131-7', account: '0023318332131'},
            {name: 'Muhammad Sumbul', rut: '33.320.755-4', account: '0023333320755'}
        ];
    }
    
    // Guardar contactos en localStorage
    function saveContacts(contacts) {
        localStorage.setItem('alke_wallet_contacts', JSON.stringify(contacts));
    }
    
    // Renderizar contactos en la tabla
    function renderContacts(contacts) {
        const tbody = document.getElementById('contacts-body');
        tbody.innerHTML = '';
        
        contacts.forEach((contact, index) => {
            const row = document.createElement('tr');
            row.className = 'contact-row';
            if (index === 2) row.classList.add('selected'); // Mantener John Doe como seleccionado por defecto
            
            row.innerHTML = `
                <td>${contact.name}</td>
                <td class="rut-column">${contact.rut}</td>
                <td class="account-column">${contact.account}</td>
            `;
            
            row.addEventListener('click', function() {
                // Remover clase selected de todas las filas
                document.querySelectorAll('.contact-row').forEach(r => r.classList.remove('selected'));
                this.classList.add('selected');
                
                // Actualizar contacto seleccionado
                document.getElementById('selected-contact-info').textContent = 
                    `${contact.name} - RUT: ${contact.rut} - Cuenta N°${contact.account}`;
            });
            
            tbody.appendChild(row);
        });
        
        // Si hay contactos, seleccionar el primero por defecto
        if (contacts.length > 0 && !document.querySelector('.contact-row.selected')) {
            const firstRow = tbody.querySelector('.contact-row');
            if (firstRow) {
                firstRow.classList.add('selected');
                const contact = contacts[0];
                document.getElementById('selected-contact-info').textContent = 
                    `${contact.name} - RUT: ${contact.rut} - Cuenta N°${contact.account}`;
            }
        }
    }
    
    // Inicializar cuando se carga la página
    document.addEventListener('DOMContentLoaded', function() {
        // Cargar y mostrar contactos
        const contacts = loadContacts();
        renderContacts(contacts);
        
        // Inicializar saldo
        updateBalanceDisplay();
        
        // Configurar botón de nuevo contacto
        const newContactBtn = document.getElementById('new-contact-btn');
        const newContactModal = new bootstrap.Modal(document.getElementById('newContactModal'));
        const saveContactBtn = document.getElementById('save-contact-btn');
        
        newContactBtn.addEventListener('click', function() {
            newContactModal.show();
        });
        
        saveContactBtn.addEventListener('click', function() {
            const name = document.getElementById('new-contact-name').value.trim();
            const rut = document.getElementById('new-contact-rut').value.trim();
            const account = document.getElementById('new-contact-account').value.trim();
            
            if (!name || !rut || !account) {
                alert('Por favor complete todos los campos');
                return;
            }
            
            // Agregar nuevo contacto
            const contacts = loadContacts();
            contacts.push({name, rut, account});
            saveContacts(contacts);
            
            // Actualizar tabla
            renderContacts(contacts);
            
            // Limpiar y cerrar modal
            document.getElementById('new-contact-name').value = '';
            document.getElementById('new-contact-rut').value = '';
            document.getElementById('new-contact-account').value = '';
            newContactModal.hide();
            
            alert('Contacto agregado exitosamente');
        });
        
        // Configurar búsqueda de contactos
        document.getElementById('contact-name').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const contacts = loadContacts();
            const filteredContacts = contacts.filter(contact => 
                contact.name.toLowerCase().includes(searchTerm) ||
                contact.rut.toLowerCase().includes(searchTerm) ||
                contact.account.toLowerCase().includes(searchTerm)
            );
            renderContacts(filteredContacts);
        });
        
        // Actualizar saldo cuando cambia la cuenta de origen
        document.getElementById('from-account').addEventListener('change', updateBalanceDisplay);
        
        // Manejar envío de dinero
        document.getElementById('transfer-form').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const amount = parseFloat(document.getElementById('amount').value);
            const fromAccount = document.getElementById('from-account').options[document.getElementById('from-account').selectedIndex].text;
            
            // Obtener contacto seleccionado
            const selectedRow = document.querySelector('.contact-row.selected');
            if (!selectedRow) {
                alert('Por favor seleccione un contacto');
                return;
            }
            
            const contactName = selectedRow.cells[0].textContent;
            const contactAccount = selectedRow.cells[2].textContent;
            
            // Validaciones
            if (!amount || amount <= 0) {
                alert('Error: Por favor ingrese un monto válido.');
                return;
            }
            
            if (amount > balances[fromAccount]) {
                alert(`Error: Saldo insuficiente. Saldo disponible: ${formatCurrency(balances[fromAccount])}`);
                return;
            }
            
            // Confirmar transferencia
            if (!confirm(`¿Está seguro de transferir ${formatCurrency(amount)} a ${contactName}?`)) {
                return;
            }
            
            // Realizar transferencia
            balances[fromAccount] -= amount;
            
            // Guardar balances actualizados
            localStorage.setItem('alke_wallet_balances', JSON.stringify(balances));
            
            // Registrar transacción
            const transaction = {
                type: 'transfer',
                from: fromAccount,
                to: contactName,
                toAccount: contactAccount,
                amount: amount,
                date: new Date().toLocaleString(),
                newBalance: balances[fromAccount]
            };
            
            let transactions = JSON.parse(localStorage.getItem('alke_wallet_transactions') || '[]');
            transactions.push(transaction);
            localStorage.setItem('alke_wallet_transactions', JSON.stringify(transactions));
            
            // Mostrar mensaje de éxito
            alert(`¡Transferencia realizada con éxito!\n\n` +
                  `Monto: ${formatCurrency(amount)}\n` +
                  `Destinatario: ${contactName}\n` +
                  `Cuenta destino: ${contactAccount}\n` +
                  `Nuevo saldo: ${formatCurrency(balances[fromAccount])}`);
            
            // Actualizar saldo mostrado
            updateBalanceDisplay();
            
            // Limpiar campo de monto
            document.getElementById('amount').value = '';
        });
    });