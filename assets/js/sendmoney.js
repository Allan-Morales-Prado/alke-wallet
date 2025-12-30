// Script para actualizar el saldo según cuenta seleccionada
    document.getElementById('from-account').addEventListener('change', function() {
      const accountNumber = this.options[this.selectedIndex].text;
      
      // Simular diferentes saldos para cada cuenta
      const balances = {
        'N°0002311423': '$140.000',
        'N°0002355196': '$75.500',
        'N°0002378830': '$210.750'
      };
      
      document.querySelector('#available-balance span').textContent = balances[accountNumber];
    });
    
    // Script para seleccionar contactos de la tabla
    const contactRows = document.querySelectorAll('.contact-row');
    const selectedContactDiv = document.querySelector('.selected-contact div');
    
    contactRows.forEach(row => {
      row.addEventListener('click', function() {
        // Remover clase selected de todas las filas
        contactRows.forEach(r => r.classList.remove('selected'));
        
        // Agregar clase selected a la fila clickeada
        this.classList.add('selected');
        
        // Actualizar contacto seleccionado
        const name = this.cells[0].textContent;
        const rut = this.cells[1].textContent;
        const account = this.cells[2].textContent;
        
        selectedContactDiv.textContent = `${name} - RUT: ${rut} - Cuenta N°${account}`;
      });
    });
    
    // Función de búsqueda
    document.getElementById('contact-name').addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      contactRows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const rut = row.cells[1].textContent.toLowerCase();
        const account = row.cells[2].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || rut.includes(searchTerm) || account.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
    
    // Validación del formulario
    document.querySelector('form').addEventListener('submit', function(event) {
      const amount = document.getElementById('ammount').value;
      
      if (!amount || amount <= 0) {
        event.preventDefault();
        alert('Error: Por favor ingrese un monto válido.');
        return false;
      }
    });