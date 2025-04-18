let scale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX, startY;

const imagenFondo = document.getElementById("imagen-fondo");

// Zoom con scroll
imagenFondo.addEventListener("wheel", function (e) {
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.min(Math.max(0.5, scale), 3);
  updateTransform();
});

// Drag (mover imagen)
imagenFondo.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
});

window.addEventListener("mouseup", () => isDragging = false);

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  posX = e.clientX - startX;
  posY = e.clientY - startY;
  updateTransform();
});

function updateTransform() {
  imagenFondo.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

// Cambiar plantilla
function cambiarPlantilla() {
  const url = document.getElementById("plantilla").value;
  document.getElementById("plantilla-bg").style.backgroundImage = `url(${url})`;
}

// Cargar imagen personalizada
document.getElementById("imagen").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    imagenFondo.style.backgroundImage = `url(${event.target.result})`;
    imagenFondo.style.backgroundSize = "contain";
    scale = 1;
    posX = 0;
    posY = 0;
    updateTransform();
  };
  reader.readAsDataURL(file);
});

// Generar texto del post
function generarPost() {
  const texto = document.getElementById("descripcion").value;
  const palabras = document.getElementById("resaltadas").value.split(",").map(p => p.trim());
  const fuente = document.getElementById("fuente").value;

  let textoHTML = texto;
  palabras.forEach(palabra => {
    if (palabra) {
      const regex = new RegExp(`(${palabra})`, 'gi');
      textoHTML = textoHTML.replace(regex, '<span class="resaltado">$1</span>');
    }
  });

  const preview = document.getElementById("preview-description");
  preview.innerHTML = textoHTML;
  preview.style.fontFamily = fuente || 'Fredoka One';
}

function descargarImagen() {
  const formato = document.getElementById("formato-descarga").value;
  const original = document.getElementById("post-preview");

  // Crear contenedor temporal
  const wrapper = document.createElement("div");
  wrapper.style.width = `${original.offsetWidth}px`;
  wrapper.style.height = `${original.offsetHeight}px`;
  wrapper.style.position = "fixed";
  wrapper.style.top = "-9999px";
  wrapper.style.left = "-9999px";
  wrapper.style.zIndex = "-1";

  // Clonar contenido
  const clone = original.cloneNode(true);
  clone.style.width = "100%";
  clone.style.height = "100%";

  // Copiar directamente el transform actual del DOM original
  const imagenFondoClonada = clone.querySelector("#imagen-fondo");
  const imagenFondoOriginal = document.getElementById("imagen-fondo");

  if (imagenFondoClonada && imagenFondoOriginal) {
    const transform = window.getComputedStyle(imagenFondoOriginal).transform;
    imagenFondoClonada.style.transform = transform;
  }

  // Ajustar texto (opcional: tamaño más grande para exportación)
  const descripcionClonada = clone.querySelector(".description");
  if (descripcionClonada) {
    descripcionClonada.style.fontSize = "44px";
    descripcionClonada.style.lineHeight = "1.4";
  }

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  html2canvas(wrapper, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    scale: 1, // No hacer zoom adicional
    width: original.offsetWidth,
    height: original.offsetHeight,
    scrollX: 0,
    scrollY: 0,
    windowWidth: original.offsetWidth,
    windowHeight: original.offsetHeight
  }).then(canvas => {
    document.body.removeChild(wrapper);
    const link = document.createElement("a");
    link.download = `DATO.${formato}`;
    link.href = canvas.toDataURL(`image/${formato}`);
    link.click();
  });
}

function zoomIn() {
  scale = Math.min(scale + 0.1, 3);
  updateTransform();
}
function zoomOut() {
  scale = Math.max(scale - 0.1, 0.5);
  updateTransform();
}

function mover(direccion) {
  const paso = 10; // cantidad de píxeles a mover
  switch (direccion) {
    case 'arriba':
      posY -= paso;
      break;
    case 'abajo':
      posY += paso;
      break;
    case 'izquierda':
      posX -= paso;
      break;
    case 'derecha':
      posX += paso;
      break;
  }
  updateTransform();
}


// Cargar plantilla por defecto y fuente inicial
window.addEventListener("DOMContentLoaded", () => {
  cambiarPlantilla();
  generarPost();
});

