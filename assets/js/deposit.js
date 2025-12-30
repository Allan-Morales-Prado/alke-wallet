// Script para actualizar el saldo disponible según la cuenta seleccionada
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
    
    // Validación para evitar que origen y destino sean la misma cuenta
    document.querySelector('form').addEventListener('submit', function(event) {
      const fromAccount = document.getElementById('from-account').value;
      const toAccount = document.getElementById('to-account').value;
      const amount = document.getElementById('ammount').value;
      
      if (fromAccount === toAccount) {
        event.preventDefault();
        alert('Error: La cuenta de origen y destino no pueden ser la misma.');
        return false;
      }
      
      if (!amount || amount <= 0) {
        event.preventDefault();
        alert('Error: Por favor ingrese un monto válido.');
        return false;
      }
    });