// Small form helpers.
export { formatActivationCode } from './format';
export { normPlate as normPlateInput } from './vehicles';

/** 2026-11-12 <-> 12/11/2026 */
export const isoToDmy = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

/** Resize a picked image to a JPEG under about 70 KB and return it as base64 (no prefix). */
export async function imageToBase64(file, maxSide = 360) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  for (const q of [0.85, 0.7, 0.55, 0.4]) {
    const url = canvas.toDataURL('image/jpeg', q);
    const b64 = url.split(',')[1];
    if (b64.length * 0.75 < 68_000) return { base64: b64, preview: url };
  }
  const url = canvas.toDataURL('image/jpeg', 0.3);
  return { base64: url.split(',')[1], preview: url };
}
