(function () {
  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const ANIO_MIN = 1900;

  const form = document.getElementById('form-edad');
  const selDia = document.getElementById('sel-dia');
  const selMes = document.getElementById('sel-mes');
  const selAnio = document.getElementById('sel-anio');
  const error = document.getElementById('error-edad');
  const salida = document.getElementById('resultado-edad');

  const hoy = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

  function opcionVacia(select, texto) {
    select.replaceChildren(new Option(texto, ''));
  }

  function llenarMeses() {
    opcionVacia(selMes, 'Mes');
    MESES.forEach((m, i) => selMes.add(new Option(m, i + 1)));
  }

  function llenarAnios() {
    opcionVacia(selAnio, 'Año');
    for (let a = hoy().getFullYear(); a >= ANIO_MIN; a--) selAnio.add(new Option(a, a));
  }

  function llenarDias() {
    const previo = selDia.value;
    const mes = Number(selMes.value);
    const anio = Number(selAnio.value) || 2000; // 2000 es bisiesto: permite el 29 de febrero
    const total = mes ? new Date(anio, mes, 0).getDate() : 31;

    opcionVacia(selDia, 'Día');
    for (let d = 1; d <= total; d++) selDia.add(new Option(d, d));
    if (previo && Number(previo) <= total) selDia.value = previo;
  }

  function limpiarEstado() {
    error.textContent = '';
    salida.textContent = '';
    [selDia, selMes, selAnio].forEach(s => s.removeAttribute('aria-invalid'));
  }

  selMes.addEventListener('change', () => { llenarDias(); limpiarEstado(); });
  selAnio.addEventListener('change', () => { llenarDias(); limpiarEstado(); });
  selDia.addEventListener('change', limpiarEstado);

  llenarMeses();
  llenarAnios();
  llenarDias();

  function validar() {
    const faltantes = [selDia, selMes, selAnio].filter(s => s.value === '');
    if (faltantes.length) {
      return { mensaje: 'Selecciona el día, el mes y el año de tu nacimiento.', campos: faltantes };
    }

    const d = Number(selDia.value), m = Number(selMes.value), a = Number(selAnio.value);
    const fecha = new Date(a, m - 1, d);
    const real = fecha.getFullYear() === a && fecha.getMonth() === m - 1 && fecha.getDate() === d;
    if (!real) return { mensaje: 'Esa fecha no existe en el calendario.', campos: [selDia] };
    if (fecha > hoy()) return { mensaje: 'La fecha de nacimiento no puede estar en el futuro.', campos: [selDia, selMes, selAnio] };

    return { fecha };
  }

  function calcularEdad(nac, ref) {
    let anios = ref.getFullYear() - nac.getFullYear();
    let meses = ref.getMonth() - nac.getMonth();
    if (ref.getDate() < nac.getDate()) meses--;
    if (meses < 0) { anios--; meses += 12; }
    return { anios, meses };
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    limpiarEstado();

    const r = validar();
    if (r.mensaje) {
      error.textContent = r.mensaje;
      r.campos.forEach(c => c.setAttribute('aria-invalid', 'true'));
      r.campos[0].focus();
      return;
    }

    const { anios, meses } = calcularEdad(r.fecha, hoy());
    const fuerte = document.createElement('strong');
    fuerte.textContent = `${plural(anios, 'año', 'años')} ${plural(meses, 'mes', 'meses')}`;
    salida.append('Tienes ', fuerte);
  });
})();
