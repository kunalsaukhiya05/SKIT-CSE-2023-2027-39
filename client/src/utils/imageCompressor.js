/**
 * Rural Low-Bandwidth Image Downscaler & WebP Converter
 * Author: Kunal Saukhiya <hgkunal@gmail.com>
 * Sprint 7 / Week 14: Client-side compression for handwritten homework uploads on 2G/3G networks
 */

export const compressImageFile = async (file, options = {}) => {
  if (!file || !file.type.startsWith("image/")) {
    return file;
  }

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.72,
    outputFormat = "image/webp",
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const compressedFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], compressedFileName, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            resolve({
              file: compressedFile,
              originalSizeKB: Math.round(file.size / 1024),
              compressedSizeKB: Math.round(compressedFile.size / 1024),
              compressionRatio: `${Math.round((1 - compressedFile.size / file.size) * 100)}%`,
            });
          },
          outputFormat,
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};
