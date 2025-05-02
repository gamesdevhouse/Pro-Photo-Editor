const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = document.querySelectorAll('.control');
const exportBtn = document.getElementById('export');
const clearBtn = document.getElementById('clear');
const uploadContainer = document.getElementById('upload-container');
let originalImage = new Image();
let filters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  blur: 0,
  'hue-rotate': 0
};

// File input change
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  loadImage(file);
});

// Drag & drop support
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('hover');
});
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('hover');
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('hover');
  const file = e.dataTransfer.files[0];
  if (file) loadImage(file);
});

// Load and render image
function loadImage(file) {
  const url = URL.createObjectURL(file);
  originalImage = new Image();
  originalImage.src = url;
  originalImage.onload = () => {
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    updateCanvas();
    canvas.style.display = 'block';
    uploadContainer.style.display = 'none';
  };
}

// Update filters
controls.forEach(control => {
  const input = control.querySelector('input');
  const filter = control.getAttribute('data-filter');
  input.addEventListener('input', () => {
    filters[filter] = input.value;
    updateCanvas();
  });
});

// Clear canvas and reset
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = 'none';
  uploadContainer.style.display = 'block';
  controls.forEach(control => {
    const filter = control.getAttribute('data-filter');
    const input = control.querySelector('input');
    if (filter === 'grayscale' || filter === 'sepia' || filter === 'invert') {
      filters[filter] = 0;
      input.value = 0;
    } else if (filter === 'blur') {
      filters[filter] = 0;
      input.value = 0;
    } else {
      filters[filter] = 100;
      input.value = 100;
    }
  });
});

// Draw with filters
function updateCanvas() {
  ctx.filter = getFilterString();
  ctx.drawImage(originalImage, 0, 0);
}

function getFilterString() {
  return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%) blur(${filters.blur}px) hue-rotate(${filters['hue-rotate']}deg)`;
}

// Export image
exportBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
