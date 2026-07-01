export async function generateTryOnPreview(userPhoto, productId) {
  const res = await fetch('/api/try-on', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userPhoto, productId }),
  });

  if (!res.ok) {
    let message = 'Try-on generation failed';
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      message = await res.text() || message;
    }
    throw new Error(message);
  }

  return res.json();
}

export function compressPhoto(dataUrl, maxWidth = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
