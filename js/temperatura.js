(function () {
  const NOMBRES = { celsius: 'Celsius', fahrenheit: 'Fahrenheit', kelvin: 'Kelvin' };

  const form = document.getElementById('form-temp');
  const valor = document.getElementById('temp-valor');
  const origen = document.getElementById('temp-origen');
  const destino = document.getElementById('temp-destino');
  const boton = document.getElementById('temp-btn');
  const salida = document.getElementById('temp-resultado');

  const aCelsius = (v, u) =>
    u === 'fahrenheit' ? (v - 32) * 5 / 9 : u === 'kelvin' ? v - 273.15 : v;
  const desdeCelsius = (c, u) =>
    u === 'fahrenheit' ? c * 9 / 5 + 32 : u === 'kelvin' ? c + 273.15 : c;

  function camposCompletos() {
    return valor.value.trim() !== '' && Number.isFinite(Number(valor.value)) &&
           origen.value !== '' && destino.value !== '';
  }

  function actualizarBoton() {
    boton.disabled = !camposCompletos();
    salida.textContent = '';
    salida.className = 'resultado';
  }

  [valor, origen, destino].forEach(c => {
    c.addEventListener('input', actualizarBoton);
    c.addEventListener('change', actualizarBoton);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!camposCompletos()) return;

    const v = Number(valor.value);
    const celsius = aCelsius(v, origen.value);
    if (celsius < -273.15) {
      salida.className = 'resultado mal';
      salida.textContent = 'Ese valor está por debajo del cero absoluto (-273.15 °C).';
      return;
    }

    const resultado = Number(desdeCelsius(celsius, destino.value).toFixed(2));
    salida.className = 'resultado ok';
    salida.textContent = `${v} ${NOMBRES[origen.value]} equivalen a ${resultado} ${NOMBRES[destino.value]}`;
  });
})();
