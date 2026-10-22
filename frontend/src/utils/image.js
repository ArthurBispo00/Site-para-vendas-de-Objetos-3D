/**
 * Lê um arquivo de imagem e devolve uma data URL redimensionada (máx. `maxSize` px).
 * Usado só pelo MOCK, para a imagem caber no LocalStorage.
 * Se o navegador não suportar canvas, devolve a data URL original.
 */
export function fileToResizedDataUrl(file, maxSize = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.onload = () => {
      const original = reader.result;
      const img = new Image();
      img.onerror = () => resolve(original);
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(original);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          resolve(original);
        }
      };
      img.src = original;
    };
    reader.readAsDataURL(file);
  });
}

/** Imagem de reserva (SVG em data URL) para produtos sem foto. */
export function makePlaceholder(label = 'Jaca 3D', from = '#2a7a49', to = '#f6c935') {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
    `<rect width="800" height="600" fill="url(#g)"/>` +
    `<g fill="none" stroke="rgba(255,255,255,.35)" stroke-width="6">` +
    `<ellipse cx="400" cy="400" rx="170" ry="40"/><ellipse cx="400" cy="350" rx="150" ry="36"/>` +
    `<ellipse cx="400" cy="300" rx="130" ry="32"/><ellipse cx="400" cy="250" rx="110" ry="28"/>` +
    `<ellipse cx="400" cy="200" rx="90" ry="24"/></g>` +
    `<text x="400" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" ` +
    `font-weight="700" fill="#ffffff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
