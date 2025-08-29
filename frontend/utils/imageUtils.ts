/**
 * Calculates the ratio to scale an image to fit within a container while maintaining aspect ratio
 * @param imageSize - The original image dimensions
 * @param containerSize - The container dimensions
 * @param scale - Optional scale factor (default: 0.95)
 * @returns The calculated ratio for scaling
 */
export const calculateImageRatio = (
  imageSize: { width: number; height: number },
  containerSize: { width: number; height: number },
  scale: number = 0.95
): number => {
  if (containerSize.height <= 0 || imageSize.height <= 0) {
    return 1;
  }

  const widthRatio = (scale * containerSize.width) / imageSize.width;
  const heightRatio = (scale * containerSize.height) / imageSize.height;
  
  // Use Math.min to maintain aspect ratio (fit within container)
  return Math.min(widthRatio, heightRatio);
};

/**
 * Hook for managing image ratio calculation with automatic updates
 * @param imageUri - The image URI
 * @param containerSize - The container dimensions
 * @param scale - Optional scale factor (default: 0.95)
 * @returns Object containing imageSize, imageRatio, and setImageSize
 */
import { useEffect, useState } from 'react';
import { Image } from 'react-native';

export const useImageRatio = (
  imageUri: string,
  containerSize: { width: number; height: number },
  scale: number = 0.95
) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageRatio, setImageRatio] = useState(1);

  useEffect(() => {
    Image.getSize(
      imageUri,
      (width, height) => {
        setImageSize({ width, height });
      },
      (error) => {
        console.error("Error getting image size:", error);
      }
    );
  }, [imageUri]);

  useEffect(() => {
    const ratio = calculateImageRatio(imageSize, containerSize, scale);
    setImageRatio(ratio);
  }, [imageSize, containerSize, scale]);

  return { imageSize, imageRatio, setImageSize };
};

export default {}