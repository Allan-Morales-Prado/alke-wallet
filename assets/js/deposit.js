// Definir balances iniciales
let balances = {
    'N°0002311423': 140000,
    'N°0002355196': 75500,
    'N°0002378830': 210750
};

// Función para formatear el saldo como moneda
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('es-CL');
}

// Actualizar el saldo disponible según la cuenta seleccionada
document.getElementById('from-account').addEventListener('change', function () {
    const accountNumber = this.options[this.selectedIndex].text;
    const balance = balances[accountNumber] || 0;
    document.querySelector('#available-balance span').textContent = formatCurrency(balance);
});

// También actualizar cuando cambia la cuenta de destino
document.getElementById('to-account').addEventListener('change', function () {
    // Podemos usar esto para mostrar información de la cuenta de destino si es necesario
    const accountNumber = this.options[this.selectedIndex].text;
    // En un caso real, podríamos mostrar el saldo de la cuenta de destino
});

// Inicializar el saldo mostrado al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const initialAccount = document.getElementById('from-account').options[0].text;
    const initialBalance = balances[initialAccount] || 0;
    document.querySelector('#available-balance span').textContent = formatCurrency(initialBalance);
});

// Manejar el envío del formulario para realizar el depósito
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const fromAccountSelect = document.getElementById('from-account');
    const toAccountSelect = document.getElementById('to-account');
    const amountInput = document.getElementById('ammount');

    const fromAccount = fromAccountSelect.options[fromAccountSelect.selectedIndex].text;
    const toAccount = toAccountSelect.options[toAccountSelect.selectedIndex].text;
    const amount = parseFloat(amountInput.value);

    // Validaciones
    if (fromAccount === toAccount) {
        alert('Error: La cuenta de origen y destino no pueden ser la misma.');
        return false;
    }

    if (!amount || amount <= 0) {
        alert('Error: Por favor ingrese un monto válido.');
        return false;
    }

    // Verificar que el monto no sea mayor al saldo disponible
    if (amount > balances[fromAccount]) {
        alert(`Error: Saldo insuficiente. Saldo disponible: ${formatCurrency(balances[fromAccount])}`);
        return false;
    }

    // Realizar el depósito (transferencia entre cuentas)
    // Restar de la cuenta de origen
    balances[fromAccount] -= amount;

    // Sumar a la cuenta de destino
    balances[toAccount] += amount;

    // Mostrar mensaje de éxito
    alert(`¡Depósito realizado con éxito!\n\n` +
        `Transferido: ${formatCurrency(amount)}\n` +
        `Desde: ${fromAccount}\n` +
        `Hacia: ${toAccount}\n\n` +
        `Nuevo saldo en ${fromAccount}: ${formatCurrency(balances[fromAccount])}\n` +
        `Nuevo saldo en ${toAccount}: ${formatCurrency(balances[toAccount])}`);

    // Actualizar el saldo mostrado en pantalla
    document.querySelector('#available-balance span').textContent = formatCurrency(balances[fromAccount]);

    // Registrar la transacción en localStorage (opcional)
    const transaction = {
        type: 'deposit',
        from: fromAccount,
        to: toAccount,
        amount: amount,
        date: new Date().toLocaleString(),
        newFromBalance: balances[fromAccount],
        newToBalance: balances[toAccount]
    };

    // Guardar en localStorage para historial
    let transactions = JSON.parse(localStorage.getItem('alke_wallet_transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('alke_wallet_transactions', JSON.stringify(transactions));

    // También guardar los balances actualizados en localStorage
    localStorage.setItem('alke_wallet_balances', JSON.stringify(balances));

    // Limpiar el campo de monto
    amountInput.value = '';

    return false;
});

// Cargar balances desde localStorage si existen
document.addEventListener('DOMContentLoaded', function () {
    const savedBalances = localStorage.getItem('alke_wallet_balances');
    if (savedBalances) {
        balances = JSON.parse(savedBalances);

        // Actualizar el saldo mostrado
        const initialAccount = document.getElementById('from-account').options[0].text;
        const initialBalance = balances[initialAccount] || 0;
        document.querySelector('#available-balance span').textContent = formatCurrency(initialBalance);
    }
});
