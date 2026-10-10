(function () {
  const vistas = Array.from(document.querySelectorAll('.vista'));
  const enlaces = Array.from(document.querySelectorAll('.pestanas a'));
  const titulo = document.getElementById('titulo');
  const subtitulo = document.getElementById('subtitulo');

  function mostrarVista() {
    const pedida = location.hash.slice(1);
    const enlace = enlaces.find(a => a.dataset.vista === pedida) || enlaces[0];
    const id = enlace.dataset.vista;

    vistas.forEach(v => { v.hidden = v.id !== id; });
    enlaces.forEach(a => {
      const activo = a === enlace;
      a.classList.toggle('activo', activo);
      if (activo) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    titulo.textContent = enlace.dataset.titulo;
    subtitulo.textContent = enlace.dataset.sub;
    document.title = `${enlace.dataset.titulo} · Portal DWI`;
  }

  window.addEventListener('hashchange', mostrarVista);
  mostrarVista();
})();
