import { useEffect, useRef, useState } from "react";
import { useAppContext } from "src/context/useAppContext";

const useImageOptimizer = ({ originalImage, optimizedToWidth }) => {
  const [resizedImageUrl, setResizedImageUrl] = useState('');
  const { imageCache: { imageCache, setImageCache } } = useAppContext();
  const imageCacheRef = useRef(imageCache);
  useEffect(() => {
    imageCacheRef.current = imageCache;
  }, [imageCache]);

  useEffect(() => {
    if(!originalImage?.src || originalImage?.src?.endsWith(".gif")){
      setResizedImageUrl(originalImage.src); 
    } else if(imageCacheRef.current?.[`${originalImage.src}_${optimizedToWidth}`]) {
      setResizedImageUrl(imageCacheRef.current?.[`${originalImage.src}_${optimizedToWidth}`]); 
    } else {
      const workerScript = `
        self.onmessage = async (e) => {
          const { imageUrl, optimizedToWidth } = e.data;
          try {
            const response = await fetch(imageUrl);
            if(!response.ok){
              self.postMessage("");
            }
            const blob = await response.blob();
            if (!blob.type.startsWith('image/')) {
              self.postMessage("");
            }
            const img = await createImageBitmap(blob);
            // Calculate the new height to preserve the aspect ratio
            const aspectRatio = img.height / img.width;
            const newHeight = optimizedToWidth * aspectRatio;
            const offscreenCanvas = new OffscreenCanvas(optimizedToWidth, newHeight);
            const ctx = offscreenCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, optimizedToWidth, newHeight);
            const resizedBlob = await offscreenCanvas.convertToBlob();
            self.postMessage(resizedBlob); // Push to mainthread
          } catch (error) {
            console.error('Error in worker:', error);
            self.postMessage("");
          }
        };
      `;
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      worker.onmessage = (e) => {
        const blob = e.data;
        const url = URL.createObjectURL(blob);
        setImageCache(prevState => ({...prevState, [`${originalImage.src}_${optimizedToWidth}`]: url }));
        setResizedImageUrl(url);
      };
      // Post the image URL along with targetWidth to the worker
      worker.postMessage({ imageUrl: originalImage.src, optimizedToWidth }); 
      // Clean up
      return () => {
        worker.terminate();
      };
    }
  }, [originalImage, optimizedToWidth, setImageCache]);

  return {
    type: originalImage.type,
    src: resizedImageUrl
  }
}

export default useImageOptimizer;