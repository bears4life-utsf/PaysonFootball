/** Crop transparent/white padding so the ink sits on the PDF signature line. */
export async function cropSignatureDataUrl(dataUrl: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read signature."));
    img.src = dataUrl;
  });

  const source = document.createElement("canvas");
  source.width = image.width;
  source.height = image.height;
  const sourceCtx = source.getContext("2d");
  if (!sourceCtx) return dataUrl;
  sourceCtx.drawImage(image, 0, 0);

  const { data, width, height } = sourceCtx.getImageData(
    0,
    0,
    source.width,
    source.height,
  );

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const alpha = data[i + 3] ?? 0;
      const r = data[i] ?? 255;
      const g = data[i + 1] ?? 255;
      const b = data[i + 2] ?? 255;
      const isInk = alpha > 20 && r + g + b < 700;
      if (!isInk) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) return dataUrl;

  const pad = 4;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const cropW = Math.min(width - left, maxX - minX + 1 + pad * 2);
  const cropH = Math.min(height - top, maxY - minY + 1 + pad * 2);

  const cropped = document.createElement("canvas");
  cropped.width = cropW;
  cropped.height = cropH;
  const croppedCtx = cropped.getContext("2d");
  if (!croppedCtx) return dataUrl;
  croppedCtx.drawImage(source, left, top, cropW, cropH, 0, 0, cropW, cropH);
  return cropped.toDataURL("image/png");
}
