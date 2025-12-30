const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    document.getElementById('date-from').valueAsDate = thirtyDaysAgo;
    document.getElementById('date-to').valueAsDate = today;
    
    // Función de búsqueda
    document.querySelector('button[type="button"]').addEventListener('click', function() {
      const searchBy = document.getElementById('search-by').value;
      const filterValue = document.getElementById('filter-value').value;
      const accountFilter = document.getElementById('account-filter').value;
      const dateFrom = document.getElementById('date-from').value;
      const dateTo = document.getElementById('date-to').value;
      
      if (!filterValue && accountFilter === 'all' && !dateFrom && !dateTo) {
        alert('Por favor, ingrese al menos un criterio de búsqueda o seleccione filtros.');
        return;
      }
      
      // Aquí iría la lógica real de búsqueda
      alert(`Buscando con criterios:\n- Tipo: ${searchBy}\n- Valor: ${filterValue || 'Ninguno'}\n- Cuenta: ${accountFilter}\n- Fecha: ${dateFrom || 'Ninguna'} a ${dateTo || 'Ninguna'}`);
    });
    
    // Función para limpiar filtros
    document.getElementById('reset-filter').addEventListener('click', function() {
      document.getElementById('search-by').selectedIndex = 0;
      document.getElementById('filter-value').value = '';
      document.getElementById('account-filter').selectedIndex = 0;
      document.getElementById('date-from').valueAsDate = thirtyDaysAgo;
      document.getElementById('date-to').valueAsDate = today;
      
      // Aquí iría la lógica para resetear la tabla
      alert('Filtros limpiados. Mostrando todas las transacciones.');
    });
    
    // Función para filtrar tabla (ejemplo simple)
    document.getElementById('filter-value').addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const rows = document.querySelectorAll('tbody tr');
      
      if (searchTerm === '') {
        rows.forEach(row => row.style.display = '');
        return;
      }
      
      rows.forEach(row => {
        const contact = row.cells[0].textContent.toLowerCase();
        const description = row.cells[1].textContent.toLowerCase();
        const amount = row.cells[2].textContent.toLowerCase();
        const date = row.cells[3].textContent.toLowerCase();
        
        if (contact.includes(searchTerm) || description.includes(searchTerm) || 
            amount.includes(searchTerm) || date.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });