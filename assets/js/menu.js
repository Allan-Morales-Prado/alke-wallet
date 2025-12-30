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
