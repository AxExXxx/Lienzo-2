const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const sizePicker = document.getElementById('size');
const clearButton = document.getElementById('clear');
const saveButton = document.getElementById('save');

// Configuración inicial del lienzo
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

// Variables para el dibujo
let drawing = false;
let brushColor = colorPicker.value;
let brushSize = sizePicker.value;

// Función para obtener las coordenadas correctas en eventos táctiles
const getTouchPos = (e) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top,
  };
};

// Funciones para dibujar
const startDrawing = (e) => {
  drawing = true;
  ctx.beginPath();
  if (e.type === 'mousedown') {
    ctx.moveTo(e.offsetX, e.offsetY);
  } else if (e.type === 'touchstart') {
    const pos = getTouchPos(e);
    ctx.moveTo(pos.x, pos.y);
  }
};

const draw = (e) => {
  if (!drawing) return;

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;

  if (e.type === 'mousemove') {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (e.type === 'touchmove') {
    const pos = getTouchPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
};

const stopDrawing = () => {
  drawing = false;
  ctx.closePath();
};

// Eventos del canvas para ratón
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Eventos del canvas para táctil
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Evitar que se desplace la pantalla
  startDrawing(e);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Evitar que se desplace la pantalla
  draw(e);
});
canvas.addEventListener('touchend', stopDrawing);

// Cambiar color y tamaño del pincel
colorPicker.addEventListener('input', (e) => (brushColor = e.target.value));
sizePicker.addEventListener('input', (e) => (brushSize = e.target.value));

// Limpiar el lienzo
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Guardar el dibujo
saveButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'mi_dibujo.png';
  link.href = canvas.toDataURL();
  link.click();
});
