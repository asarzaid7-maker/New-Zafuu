/**
 * Validates and processes user uploaded image files for profile pictures.
 * Scales and crops to a crisp 256x256 square image, returned as an optimized base64 data URL.
 */
export async function processProfileImage(file: File): Promise<string> {
  // Validate MIME type
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, WEBP, or GIF).');
  }

  // Validate file size limit (12 MB max input)
  const MAX_SIZE_BYTES = 12 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Image size is too large. Please select a photo under 12MB.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read the selected image file.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Unable to decode the image. Please try another photo.'));
      };

      img.onload = () => {
        try {
          const targetSize = 256;
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas rendering context unavailable.'));
            return;
          }

          // Center crop calculation
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(
            img,
            sx,
            sy,
            minDim,
            minDim,
            0,
            0,
            targetSize,
            targetSize
          );

          // Convert to WebP if supported, fallback to JPEG
          let dataUrl = canvas.toDataURL('image/webp', 0.88);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          }

          resolve(dataUrl);
        } catch (err: any) {
          reject(new Error(err?.message || 'Failed to process image.'));
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
