// Luxon y Flatpickr se cargan desde node_modules (instalados con npm)
const { DateTime } = luxon;

const campoFecha = document.getElementById("fecha");
const formulario = document.getElementById("formulario");
const mensajeError = document.getElementById("error");
const seccionResultado = document.getElementById("resultado");
const textoEdad = document.getElementById("edad");
const textoDetalle = document.getElementById("detalle");

// 1. Datepicker externo (Flatpickr) en español, sin fechas futuras
flatpickr(campoFecha, {
  locale: "es",
  dateFormat: "d/m/Y",
  maxDate: "today",
  allowInput: true, // permite escribir, por eso validamos después
});

function mostrarError(texto) {
  mensajeError.textContent = texto;
  campoFecha.classList.add("invalido");
  seccionResultado.hidden = true;
}

function limpiarError() {
  mensajeError.textContent = "";
  campoFecha.classList.remove("invalido");
}

function plural(n, singular, pluralTexto) {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}

// 2. Validación + cálculo con Luxon
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  limpiarError();

  const texto = campoFecha.value.trim();
  if (!texto) {
    mostrarError("Por favor ingresa tu fecha de nacimiento.");
    return;
  }

  const nacimiento = DateTime.fromFormat(texto, "dd/MM/yyyy");
  if (!nacimiento.isValid) {
    mostrarError("La fecha no es válida. Usa el formato dd/mm/aaaa (ej: 15/03/2000).");
    return;
  }

  const hoy = DateTime.now().startOf("day");
  if (nacimiento > hoy) {
    mostrarError("La fecha no puede estar en el futuro.");
    return;
  }

  const { years, months, days } = hoy
    .diff(nacimiento, ["years", "months", "days"])
    .toObject();

  textoEdad.textContent =
    `${plural(years, "año", "años")} y ${plural(months, "mes", "meses")}`;
  textoDetalle.textContent =
    `(y ${plural(Math.floor(days), "día", "días")} más)`;
  seccionResultado.hidden = false;
});

// Quita el error en cuanto el usuario cambia la fecha
campoFecha.addEventListener("input", limpiarError);
