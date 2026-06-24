document.addEventListener('DOMContentLoaded', () => {
  const productosKey = 'productos';
  const usuariosKey = 'usuarios';
  let editingId = null;
  let editingUsuarioId = null;

  function getProductos() {
    const p = localStorage.getItem(productosKey);
    if (p) return JSON.parse(p);
    // valor por defecto si no hay productos guardados
    return [
      {id: 1, nombre: 'Remera Chrome Hearts', precio: 48500, precioFormato: '$48.500', descripcion: '', imagen: 'img/remera.jpg', stock: 10},
      {id: 2, nombre: 'Pantalón True Religion BC', precio: 84500, precioFormato: '$84.500', descripcion: '', imagen: 'img/pantalon.jpg', stock: 5},
      {id: 3, nombre: 'Campera Moncler WHITE', precio: 220000, precioFormato: '$220.000', descripcion: '', imagen: 'img/campera.jpg', stock: 2}
    ];
  }

  function saveProductos(arr) {
    localStorage.setItem(productosKey, JSON.stringify(arr));
  }

  function getUsuarios() {
    const u = localStorage.getItem(usuariosKey);
    if (u) return JSON.parse(u);
    return [
      {id: 1, nombre: 'admin', rol: 'Administrador', mail: 'admin@veloura.com', contraseña: '1234'}
    ];
  }

  function saveUsuarios(arr) {
    localStorage.setItem(usuariosKey, JSON.stringify(arr));
  }

  function formatPrice(num) {
    return '$' + Number(num).toLocaleString('es-AR');
  }

  function renderProductos() {
    const container = document.querySelector('.productos-container');
    if (!container) return;
    const productos = getProductos();

    container.innerHTML = productos.map(p => `
      <div class="card-producto" data-id="${p.id}">
        <div class="imagen-container">
          <img src="${p.imagen}" alt="${p.nombre}" class="producto-imagen">
        </div>
        <div class="producto-info">
          <h3 class="producto-nombre">${p.nombre}</h3>
          <p class="producto-precio">${p.precioFormato ? p.precioFormato : formatPrice(p.precio)}</p>
          <button class="btn-carrito">Agregar al carrito</button>
        </div>
      </div>
    `).join('');

    // Adjuntar manejadores para botones "Agregar al carrito" (evita duplicar listeners del carrito)
    document.querySelectorAll('.btn-carrito').forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', (e) => {
        const card = e.target.closest('.card-producto');
        const nombre = card.querySelector('.producto-nombre').textContent;
        const precioText = card.querySelector('.producto-precio').textContent;
        const precioNumero = parseInt(precioText.replace(/\D/g, '')) || 0;
        const id = parseInt(card.dataset.id) || Date.now();

        if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
          window.carrito.agregarProducto({ id, nombre, precio: precioNumero, precioFormato: precioText });
        }

        newBtn.textContent = '✓ Agregado';
        setTimeout(() => { newBtn.textContent = 'Agregar al carrito'; }, 1500);
      });
    });
  }

  function renderVendedorTable() {
    const table = document.getElementById('tablaProductosVendedor');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const productos = getProductos();

    tbody.innerHTML = productos.map(p => `
      <tr data-id="${p.id}">
        <td><img src="${p.imagen}" alt="${p.nombre}" style="height:60px; object-fit:cover;"></td>
        <td>${p.nombre}</td>
        <td>${p.precioFormato ? p.precioFormato : formatPrice(p.precio)}</td>
        <td>${p.imagen}</td>
        <td>${p.stock != null ? p.stock : ''}</td>
        <td>
          <button class="btn-editar-vendedor" data-id="${p.id}">Editar</button>
          <button class="btn-eliminar-vendedor" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function renderUsuariosTable() {
    const table = document.getElementById('tablaUsuarios');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const usuarios = getUsuarios();

    tbody.innerHTML = usuarios.map(u => `
      <tr data-id="${u.id}">
        <td>${u.nombre}</td>
        <td>${u.rol}</td>
        <td>${u.mail}</td>
        <td>${u.contraseña}</td>
        <td>
          <button class="btn-editar-usuario" data-id="${u.id}">Editar</button>
          <button class="btn-eliminar-usuario" data-id="${u.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function deleteProductoById(id) {
    let productos = getProductos();
    productos = productos.filter(p => p.id !== id);
    saveProductos(productos);
    renderVendedorTable();
    renderProductos();
  }

  function deleteUsuarioById(id) {
    let usuarios = getUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    saveUsuarios(usuarios);
    renderUsuariosTable();
  }

  function setFormToEdit(product) {
    const nombreEl = document.getElementById('nombre');
    const precioEl = document.getElementById('precio');
    const descripcionEl = document.getElementById('descripcion');
    const imagenEl = document.getElementById('imagen');
    const stockEl = document.getElementById('stock');
    const editingEl = document.getElementById('editingId');
    const submitBtn = document.getElementById('submitProducto');

    if (!nombreEl || !precioEl) return;
    editingId = product.id;
    editingEl.value = product.id;
    nombreEl.value = product.nombre || '';
    precioEl.value = product.precio != null ? product.precio : '';
    descripcionEl.value = product.descripcion || '';
    imagenEl.value = product.imagen || '';
    if (stockEl) stockEl.value = product.stock != null ? product.stock : '';
    if (submitBtn) submitBtn.textContent = 'Guardar cambios';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    const nombreEl = document.getElementById('nombre');
    const precioEl = document.getElementById('precio');
    const descripcionEl = document.getElementById('descripcion');
    const imagenEl = document.getElementById('imagen');
    const stockEl = document.getElementById('stock');
    const editingEl = document.getElementById('editingId');
    const submitBtn = document.getElementById('submitProducto');

    if (nombreEl) nombreEl.value = '';
    if (precioEl) precioEl.value = '';
    if (descripcionEl) descripcionEl.value = '';
    if (imagenEl) imagenEl.value = '';
    if (stockEl) stockEl.value = '';
    if (editingEl) editingEl.value = '';
    editingId = null;
    if (submitBtn) submitBtn.textContent = 'Agregar producto';
  }

  // Manejo del formulario en la pantalla de vendedor
  const form = document.getElementById('formProductoAgregar') || document.getElementById('formProducto');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombreEl = document.getElementById('nombre');
      const precioEl = document.getElementById('precio');
      const descripcionEl = document.getElementById('descripcion');
      const imagenEl = document.getElementById('imagen');
      const stockEl = document.getElementById('stock');
      const editingEl = document.getElementById('editingId');

      const nombre = nombreEl ? nombreEl.value.trim() : '';
      const precio = precioEl ? parseFloat(precioEl.value) : 0;
      const descripcion = descripcionEl ? descripcionEl.value.trim() : '';
      const imagen = imagenEl ? imagenEl.value.trim() : 'img/remera.jpg';
      const stock = stockEl ? parseInt(stockEl.value) : 0;

      if (!nombre || isNaN(precio) || isNaN(stock)) {
        alert('Complete el nombre, precio y stock correctamente.');
        return;
      }

      const productos = getProductos();

      if (editingEl && editingEl.value) {
        // editar producto existente
        const id = parseInt(editingEl.value);
        const idx = productos.findIndex(p => p.id === id);
        if (idx !== -1) {
          productos[idx].nombre = nombre;
          productos[idx].precio = precio;
          productos[idx].precioFormato = formatPrice(precio);
          productos[idx].descripcion = descripcion;
          productos[idx].imagen = imagen;
          productos[idx].stock = stock;
          saveProductos(productos);
          renderVendedorTable();
          renderProductos();
          resetForm();
          return;
        }
      }

      // crear nuevo producto
      const id = Date.now();
      const producto = { id, nombre, precio, precioFormato: formatPrice(precio), descripcion, imagen, stock };
      productos.push(producto);
      saveProductos(productos);

      // Si estamos en la pantalla de vendedor, actualizar tabla y limpiar formulario
      const tablaV = document.getElementById('tablaProductosVendedor');
      if (tablaV) {
        renderVendedorTable();
        renderProductos();
        // limpiar formulario
        resetForm();
        return; // quedarse en la página
      }

      // Si no estamos en vendedor, redirigir al catálogo
      window.location.href = 'index1.html';
    });
  }

  // Delegación para botones editar/eliminar en la tabla de vendedor
  const table = document.getElementById('tablaProductosVendedor');
  if (table) {
    table.addEventListener('click', (e) => {
      const btnEdit = e.target.closest('.btn-editar-vendedor');
      if (btnEdit) {
        const id = parseInt(btnEdit.getAttribute('data-id'));
        const productos = getProductos();
        const prod = productos.find(p => p.id === id);
        if (prod) setFormToEdit(prod);
        return;
      }

      const btn = e.target.closest('.btn-eliminar-vendedor');
      if (btn) {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('¿Eliminar este producto?')) {
          deleteProductoById(id);
        }
      }
    });
  }

  function setUsuarioFormToEdit(usuario) {
    const nombreEl = document.getElementById('usuarioNombre');
    const rolEl = document.getElementById('usuarioRol');
    const mailEl = document.getElementById('usuarioMail');
    const contraseñaEl = document.getElementById('usuarioPassword');
    const editingEl = document.getElementById('editingUsuarioId');
    const submitBtn = document.getElementById('submitUsuario');

    if (!nombreEl || !rolEl || !mailEl || !contraseñaEl) return;
    editingUsuarioId = usuario.id;
    editingEl.value = usuario.id;
    nombreEl.value = usuario.nombre || '';
    rolEl.value = usuario.rol || '';
    mailEl.value = usuario.mail || '';
    contraseñaEl.value = usuario.contraseña || '';
    if (submitBtn) submitBtn.textContent = 'Guardar cambios';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetUsuarioForm() {
    const nombreEl = document.getElementById('usuarioNombre');
    const rolEl = document.getElementById('usuarioRol');
    const mailEl = document.getElementById('usuarioMail');
    const contraseñaEl = document.getElementById('usuarioPassword');
    const editingEl = document.getElementById('editingUsuarioId');
    const submitBtn = document.getElementById('submitUsuario');

    if (nombreEl) nombreEl.value = '';
    if (rolEl) rolEl.value = '';
    if (mailEl) mailEl.value = '';
    if (contraseñaEl) contraseñaEl.value = '';
    if (editingEl) editingEl.value = '';
    editingUsuarioId = null;
    if (submitBtn) submitBtn.textContent = 'Agregar usuario';
  }

  const usuarioForm = document.getElementById('formUsuarioAgregar');
  if (usuarioForm) {
    usuarioForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombreEl = document.getElementById('usuarioNombre');
      const rolEl = document.getElementById('usuarioRol');
      const mailEl = document.getElementById('usuarioMail');
      const contraseñaEl = document.getElementById('usuarioPassword');
      const editingEl = document.getElementById('editingUsuarioId');

      const nombre = nombreEl ? nombreEl.value.trim() : '';
      const rol = rolEl ? rolEl.value.trim() : '';
      const mail = mailEl ? mailEl.value.trim() : '';
      const contraseña = contraseñaEl ? contraseñaEl.value.trim() : '';

      if (!nombre || !rol || !mail || !contraseña) {
        alert('Complete todos los campos del usuario.');
        return;
      }

      const usuarios = getUsuarios();
      if (editingEl && editingEl.value) {
        const id = parseInt(editingEl.value);
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx !== -1) {
          usuarios[idx].nombre = nombre;
          usuarios[idx].rol = rol;
          usuarios[idx].mail = mail;
          usuarios[idx].contraseña = contraseña;
          saveUsuarios(usuarios);
          renderUsuariosTable();
          resetUsuarioForm();
          return;
        }
      }

      const id = Date.now();
      usuarios.push({ id, nombre, rol, mail, contraseña });
      saveUsuarios(usuarios);
      renderUsuariosTable();
      resetUsuarioForm();
    });
  }

  const usuarioTable = document.getElementById('tablaUsuarios');
  if (usuarioTable) {
    usuarioTable.addEventListener('click', (e) => {
      const btnEdit = e.target.closest('.btn-editar-usuario');
      if (btnEdit) {
        const id = parseInt(btnEdit.getAttribute('data-id'));
        const usuarios = getUsuarios();
        const usuario = usuarios.find(u => u.id === id);
        if (usuario) setUsuarioFormToEdit(usuario);
        return;
      }

      const btn = e.target.closest('.btn-eliminar-usuario');
      if (btn) {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('¿Eliminar este usuario?')) {
          deleteUsuarioById(id);
        }
      }
    });
  }

  renderProductos();
  renderVendedorTable();
  renderUsuariosTable();

  renderProductos();
  renderVendedorTable();
});