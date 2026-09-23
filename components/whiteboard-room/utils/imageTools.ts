"use client";

/**
 * Board images travel through the room's event log, so a 6 MB phone photo
 * can't be shared as-is. Downscale to a sensible teaching size and re-encode
 * before it goes on the board (JPEG on a white background — also flattens
 * transparent PNG diagrams so they read well on the paper).
 */
export async function fileToBoardImage(
  file: File,
  maxDim = 1600,
  maxBytes = 650_000
): Promise<{ src: string; width: number; height: number }> {
  if (!/^image\/(png|jpe?g|gif|webp|bmp)$/i.test(file.type)) {
    throw new Error("Please choose a PNG, JPG, GIF or WebP image.");
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("That image could not be opened."));
    el.src = dataUrl;
  });

  let dim = maxDim;
  let quality = 0.85;
  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, dim / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const out = canvas.toDataURL("image/jpeg", quality);
    if (out.length <= maxBytes) return { src: out, width: w, height: h };
    dim = Math.round(dim * 0.8);
    quality = Math.max(0.6, quality - 0.07);
  }
  throw new Error("That image is too large to share on the board.");
}
