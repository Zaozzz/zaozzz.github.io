/* The supplied emblem, sampled once per layout, illuminated by a slow pixel tide. */
(() => {
  const canvas = document.getElementById('zaozPixelPaper');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const logo = new Image();
  const sample = document.createElement('canvas');
  const sampleContext = sample.getContext('2d', { willReadFrequently: true });
  const paper = document.createElement('canvas');
  const paperContext = paper.getContext('2d');
  if (!paperContext) return;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cell = 11;
  const glowSurface = canvas.dataset.surface === 'glow';
  const frameInterval = 1000 / 24;
  let points = [];
  let width = 0;
  let height = 0;
  let pendingFrame = 0;
  let lastFrame = 0;
  let frameCount = 0;
  let needsLayout = true;

  function opacity(styles, name, fallback) {
    const value = parseFloat(styles.getPropertyValue(name));
    return Number.isFinite(value) ? Math.max(0, Math.min(value, .3)) : fallback;
  }

  function rebuild() {
    needsLayout = false;
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = paper.width = Math.round(width * ratio);
    canvas.height = paper.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    paperContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    const styles = getComputedStyle(document.body);
    if (!glowSurface) {
    paperContext.fillStyle = styles.getPropertyValue('--paper').trim() || '#fff';
    paperContext.fillRect(0, 0, width, height);
    // The original 11px paper grid stays still while its pixels glow.
    paperContext.lineWidth = 1;
    for (let x = 0; x <= width; x += cell) {
      paperContext.strokeStyle = x % 22 === 0 ? 'rgba(26,22,18,.030)' : 'rgba(26,22,18,.014)';
      paperContext.beginPath();
      paperContext.moveTo(x + .5, 0);
      paperContext.lineTo(x + .5, height);
      paperContext.stroke();
    }
    for (let y = 0; y <= height; y += cell) {
      paperContext.strokeStyle = y % 22 === 0 ? 'rgba(26,22,18,.030)' : 'rgba(26,22,18,.014)';
      paperContext.beginPath();
      paperContext.moveTo(0, y + .5);
      paperContext.lineTo(width, y + .5);
      paperContext.stroke();
    }

    }

    points = [];
    if (logo.naturalWidth && sampleContext) {
      const columns = Math.max(1, Math.floor(Math.min(width - 44, 1056) / cell));
      const rows = Math.max(1, Math.round(columns * logo.naturalHeight / logo.naturalWidth));
      const resolution = 8;
      sample.width = columns * resolution;
      sample.height = rows * resolution;
      sampleContext.drawImage(logo, 0, 0, sample.width, sample.height);
      let pixels;
      try {
        pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
      } catch (_) {
        // Keep the paper usable if an externally hosted image cannot be sampled.
        canvas.dataset.logoState = 'unavailable';
      }
      const left = Math.round((width - columns * cell) / (2 * cell)) * cell;
      const top = Math.round((height * .62 - rows * cell / 2) / cell) * cell;
      const sunOpacity = opacity(styles, '--pixel-sun-opacity', .085);
      const mountainOpacity = opacity(styles, '--pixel-mountain-opacity', .045);

      if (pixels) {
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
            points.push({
              x: left + column * cell + 1,
              y: top + row * cell + 1,
              color: glowSurface && !warm ? `188,176,166` : `${red},${green},${blue}`,
              opacity: warm ? sunOpacity : mountainOpacity,
              warm,
              // Fixed phases preserve the exact logo silhouette.
              phase: column * .092 + row * .15,
              shimmer: ((column * 73 + row * 151) % 997) / 997 * Math.PI * 2
            });
          }
        }
        canvas.dataset.logoState = 'ready';
      }
    }
    canvas.dataset.filledCells = String(points.length);
    canvas.dataset.cellSize = String(cell);
    canvas.dataset.fps = '24';
  }

  function paint(time, moving) {
    context.clearRect(0, 0, width, height);
    context.drawImage(paper, 0, 0, width, height);
    for (const point of points) {
      // Slow diagonal waves and smooth, faint per-cell shimmer.
      const tide = moving ? Math.sin(point.phase - time * .52) : 0;
      const front = moving ? Math.pow(Math.max(0, Math.cos(point.phase - time * .72)), 16) : 0;
      const shimmer = moving ? Math.pow(Math.max(0, Math.sin(time * .88 + point.shimmer)), 18) : 0;
      const alpha = moving
        ? point.opacity * (.84 + tide * .16) + front * (point.warm ? .10 : .065) + shimmer * .018
        : point.opacity;
      context.fillStyle = `rgba(${point.color},${Math.min(alpha, .22).toFixed(4)})`;
      context.fillRect(point.x, point.y, cell - 1, cell - 1);
    }
    canvas.dataset.frame = String(++frameCount);
  }

  function tick(now) {
    pendingFrame = 0;
    if (document.hidden) {
      canvas.dataset.motion = 'paused';
      return;
    }
    const changed = needsLayout;
    if (changed) rebuild();
    const moving = !motionPreference.matches && points.length > 0;
    if (changed || !lastFrame || now - lastFrame >= frameInterval) {
      paint(now / 1000, moving);
      lastFrame = now;
    }
    canvas.dataset.motion = motionPreference.matches ? 'reduced' : moving ? 'flowing' : 'static';
    if (moving) schedule();
  }

  function schedule() {
    if (document.hidden) {
      canvas.dataset.motion = 'paused';
      return;
    }
    if (!pendingFrame) pendingFrame = requestAnimationFrame(tick);
  }

  function refresh() {
    needsLayout = true;
    lastFrame = 0;
    schedule();
  }

  function motionChanged() {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    lastFrame = 0;
    schedule();
  }

  logo.addEventListener('load', refresh, { once: true });
  logo.addEventListener('error', () => {
    canvas.dataset.logoState = 'unavailable';
    refresh();
  }, { once: true });
  window.addEventListener('resize', refresh, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    lastFrame = 0;
    if (document.hidden) canvas.dataset.motion = 'paused';
    else schedule();
  });
  if (motionPreference.addEventListener) motionPreference.addEventListener('change', motionChanged);
  else motionPreference.addListener(motionChanged);
  if (window.MutationObserver) {
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
  }
  logo.src = '/assets/zaoz/zaoz-sunrise.png';
  schedule();
})();
