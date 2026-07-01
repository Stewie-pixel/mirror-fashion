import { generateTryOnPreview, compressPhoto } from './api.js';

export async function generatePreview(userPhotoSrc, _outfitImageSrc, product) {
  const userPhoto = await compressPhoto(userPhotoSrc);
  return generateTryOnPreview(userPhoto, product.id);
}

export function animateGauge(target) {
  const gaugeFill = document.getElementById('gauge-fill');
  const gaugeLabel = document.getElementById('gauge-label');
  const circumference = 163;
  gaugeFill.style.strokeDashoffset = circumference;
  gaugeLabel.textContent = '0';
  let val = 0;
  clearInterval(animateGauge._t);
  animateGauge._t = setInterval(() => {
    val += 3;
    if (val >= target) {
      val = target;
      clearInterval(animateGauge._t);
    }
    gaugeLabel.textContent = val;
    gaugeFill.style.strokeDashoffset = circumference - (circumference * val / 100);
  }, 22);
}
