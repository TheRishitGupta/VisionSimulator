const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const humanImg = document.getElementById('humanImg');
const dogCanvas = document.getElementById('dogCanvas');
const comparison = document.getElementById('comparison');
const ctx = dogCanvas.getContext('2d');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) processFile(file);
});

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
});

function processFile(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = e => {
    humanImg.src = e.target.result;
    const img = new Image();
    img.onload = () => {
      dogCanvas.width = img.width;
      dogCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      applyDogVision();
      comparison.style.display = 'flex';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function applyDogVision() {
  const imageData = ctx.getImageData(0, 0, dogCanvas.width, dogCanvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;

    r = Math.pow(r, 2.2);
    g = Math.pow(g, 2.2);
    b = Math.pow(b, 2.2);

    const nr = (0.62 * r + 0.38 * g) * 0.78;
    const ng = (0.25 * r + 0.70 * g + 0.05 * b) * 1.12;
    const nb = (0.15 * r + 0.25 * g + 0.60 * b) * 0.94;

    data[i]     = Math.min(255, Math.max(0, Math.pow(nr, 1/2.2) * 255));
    data[i + 1] = Math.min(255, Math.max(0, Math.pow(ng, 1/2.2) * 255));
    data[i + 2] = Math.min(255, Math.max(0, Math.pow(nb, 1/2.2) * 255));
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.filter = 'blur(1.1px)';
  ctx.drawImage(dogCanvas, 0, 0);
  ctx.filter = 'none';
}
