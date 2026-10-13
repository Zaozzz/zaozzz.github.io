/* Sample the supplied logo into grid cells; never redraw its underlying shape. */
(() => {
  const canvas = document.getElementById('zaozPixelPaper');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const logo = new Image();
  const sample = document.createElement('canvas');
  const sampleContext = sample.getContext('2d', { willReadFrequently: true });
  let pendingFrame = 0;

  function draw() {
    pendingFrame = 0;
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const styles = getComputedStyle(document.body);
    context.fillStyle = styles.getPropertyValue('--paper').trim() || '#fff';
    context.fillRect(0, 0, width, height);

    if (logo.naturalWidth && sampleContext) {
      const cell = width <= 620 ? 11 : 22;
      const columns = Math.max(1, Math.floor(Math.min(width - 44, 1056) / cell));
      const rows = Math.max(1, Math.round(columns * logo.naturalHeight / logo.naturalWidth));
      const resolution = 8;
      sample.width = columns * resolution;
      sample.height = rows * resolution;
      sampleContext.drawImage(logo, 0, 0, sample.width, sample.height);
      const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
      const left = Math.round((width - columns * cell) / (2 * cell)) * cell;
      const top = Math.round((height * .62 - rows * cell / 2) / cell) * cell;
      const sunOpacity = Number(styles.getPropertyValue('--pixel-sun-opacity')) || .085;
      const mountainOpacity = Number(styles.getPropertyValue('--pixel-mountain-opacity')) || .045;
      let filled = 0;

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          let alpha = 0, red = 0, green = 0, blue = 0;
          for (let y = 0; y < resolution; y++) {
            for (let x = 0; x < resolution; x++) {
              const offset = ((row * resolution + y) * sample.width + column * resolution + x) * 4;
              const weight = pixels[offset + 3] / 255;
              alpha += weight;
              red += pixels[offset] * weight;
              green += pixels[offset + 1] * weight;
              blue += pixels[offset + 2] * weight;
            }
          }
          if (alpha / (resolution * resolution) < .08) continue;
          red = Math.round(red / alpha);
          green = Math.round(green / alpha);
          blue = Math.round(blue / alpha);
          const warm = red > blue + 35;
          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${warm ? sunOpacity : mountainOpacity})`;
          context.fillRect(left + column * cell + 1, top + row * cell + 1, cell - 1, cell - 1);
          filled++;
        }
      }
      canvas.dataset.filledCells = String(filled);
      canvas.dataset.cellSize = String(cell);
    }

    // Grid lines are drawn last so even the filled cells retain their paper edges.
    context.lineWidth = 1;
    for (let x = 0; x <= width; x += 11) {
      context.strokeStyle = x % 22 === 0 ? 'rgba(26,22,18,.030)' : 'rgba(26,22,18,.014)';
      context.beginPath();
      context.moveTo(x + .5, 0);
      context.lineTo(x + .5, height);
      context.stroke();
    }
    for (let y = 0; y <= height; y += 11) {
      context.strokeStyle = y % 22 === 0 ? 'rgba(26,22,18,.030)' : 'rgba(26,22,18,.014)';
      context.beginPath();
      context.moveTo(0, y + .5);
      context.lineTo(width, y + .5);
      context.stroke();
    }
  }

  function scheduleDraw() {
    if (!pendingFrame) pendingFrame = requestAnimationFrame(draw);
  }
  logo.addEventListener('load', scheduleDraw, { once: true });
  logo.src = '/assets/zaoz/zaoz-sunrise.png';
  window.addEventListener('resize', scheduleDraw, { passive: true });
  draw();
})();
