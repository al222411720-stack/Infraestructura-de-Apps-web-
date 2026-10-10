(function () {
  const CLAVE = 'dwi-tareas';

  const form = document.getElementById('form-tarea');
  const texto = document.getElementById('tarea-texto');
  const error = document.getElementById('tarea-error');
  const lista = document.getElementById('lista-tareas');
  const vacio = document.getElementById('tareas-vacio');
  const conteo = document.getElementById('tareas-conteo');

  let tareas = cargar();

  function cargar() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE));
      if (Array.isArray(datos)) {
        return datos
          .filter(t => t && typeof t.descripcion === 'string')
          .map(t => ({ descripcion: t.descripcion, completada: Boolean(t.completada) }));
      }
    } catch (e) { /* sin almacenamiento disponible */ }
    return [];
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(tareas)); } catch (e) { /* ignorar */ }
  }

  function insertarPendiente(tarea) {
    let ultima = -1;
    tareas.forEach((t, i) => { if (!t.completada) ultima = i; });
    tareas.splice(ultima + 1, 0, tarea);
  }

  function crearItem(tarea, indice) {
    const li = document.createElement('li');
    li.className = 'tarea' + (tarea.completada ? ' hecha' : '');

    const etiqueta = document.createElement('label');
    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.checked = tarea.completada;
    casilla.addEventListener('change', () => alternar(indice));

    const descripcion = document.createElement('span');
    descripcion.textContent = tarea.descripcion;
    etiqueta.append(casilla, descripcion);

    const borrar = document.createElement('button');
    borrar.type = 'button';
    borrar.className = 'borrar';
    borrar.textContent = 'Eliminar';
    borrar.setAttribute('aria-label', `Eliminar tarea: ${tarea.descripcion}`);
    borrar.addEventListener('click', () => eliminar(indice));

    li.append(etiqueta, borrar);
    return li;
  }

  function renderTasks() {
    lista.replaceChildren();
    const pendientes = [];
    const completadas = [];
    tareas.forEach((t, i) => (t.completada ? completadas : pendientes).push({ t, i }));
    [...pendientes, ...completadas].forEach(({ t, i }) => lista.append(crearItem(t, i)));

    vacio.hidden = tareas.length > 0;
    conteo.textContent = tareas.length
      ? `${pendientes.length} pendiente(s) · ${completadas.length} completada(s)`
      : '';
  }

  function agregar(descripcion) {
    insertarPendiente({ descripcion, completada: false });
    guardar();
    renderTasks();
  }

  function alternar(indice) {
    const [tarea] = tareas.splice(indice, 1);
    tarea.completada = !tarea.completada;
    if (tarea.completada) tareas.push(tarea);   // completada: al final de la lista
    else insertarPendiente(tarea);              // desmarcada: vuelve al bloque de pendientes
    guardar();
    renderTasks();
  }

  function eliminar(indice) {
    tareas.splice(indice, 1);
    guardar();
    renderTasks();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const descripcion = texto.value.trim();
    if (!descripcion) {
      error.textContent = 'Escribe una descripción para la tarea.';
      texto.focus();
      return;
    }
    error.textContent = '';
    agregar(descripcion);
    texto.value = '';
    texto.focus();
  });

  texto.addEventListener('input', () => { error.textContent = ''; });

  renderTasks();
})();
