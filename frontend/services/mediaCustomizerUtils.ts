/**
 * Resizes and compresses an uploaded portrait image to a balanced resolution
 * suitable for the Gemini Live avatarConfig payload.
 */
export const processPortraitImage = (
  file: File,
  maxDimension = 960
): Promise<{
  base64: string;
  dataUrl: string;
  mimeType: string;
  width: number;
  height: number;
  fileName: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Scale down keeping aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with good quality (0.85) to keep payload optimal
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.85);
        const base64 = dataUrl.split(',')[1];

        resolve({
          base64,
          dataUrl,
          mimeType,
          width,
          height,
          fileName: file.name
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Processes an uploaded vertical video clip:
 * 1. Creates an object URL for idle/standby video playback.
 * 2. Seeks to the first keyframe (e.g. 0.2s) and extracts a portrait JPEG
 *    to be passed to avatarConfig.customizedAvatar.
 */
export const processVerticalVideo = (
  file: File
): Promise<{
  videoUrl: string;
  posterBase64: string;
  posterDataUrl: string;
  mimeType: string;
  duration: number;
  width: number;
  height: number;
  fileName: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      reject(new Error('Selected file is not a video'));
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    let hasExtracted = false;

    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
    };

    video.onloadeddata = () => {
      // Seek slightly into the video to avoid initial black frames
      video.currentTime = Math.min(0.2, (video.duration || 1) / 4);
    };

    video.onseeked = () => {
      if (hasExtracted) return;
      hasExtracted = true;

      try {
        const vWidth = video.videoWidth || 720;
        const vHeight = video.videoHeight || 1280;

        const maxDim = 960;
        let targetW = vWidth;
        let targetH = vHeight;

        if (targetW > maxDim || targetH > maxDim) {
          if (targetW > targetH) {
            targetH = Math.round((targetH * maxDim) / targetW);
            targetW = maxDim;
          } else {
            targetW = Math.round((targetW * maxDim) / targetH);
            targetH = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          cleanup();
          reject(new Error('Could not create canvas context for video snapshot'));
          return;
        }

        ctx.drawImage(video, 0, 0, targetW, targetH);
        const mimeType = 'image/jpeg';
        const posterDataUrl = canvas.toDataURL(mimeType, 0.85);
        const posterBase64 = posterDataUrl.split(',')[1];

        resolve({
          videoUrl,
          posterBase64,
          posterDataUrl,
          mimeType: file.type || 'video/mp4',
          duration: video.duration || 0,
          width: vWidth,
          height: vHeight,
          fileName: file.name
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to load video file for extraction'));
    };
  });
};
