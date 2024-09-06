import { useEffect, useRef, useState } from "react";
import { useAppContext } from "src/context/useAppContext";

const useMultiImageOptimizer = ({ originalImages, optimizedToWidth }) => {
  const [resizedImageUrls, setResizedImageUrls] = useState([]);
  const { imageCache: { setImageCache, imageCache} } = useAppContext();
  const imageCacheRef = useRef(imageCache);
  useEffect(() => {
    imageCacheRef.current = imageCache;
  }, [imageCache]);

  useEffect(() => {
    // Initialize an array to hold the URLs of the optimized images
    const urls = [];

    // Function to update the state with the new URL
    const updateUrl = (newUrl, index) => {
      urls[index] = newUrl; // Update the specific index with the new URL
      setResizedImageUrls([...urls]); // Spread into a new array to trigger re-render
    };

    originalImages.forEach((originalImage, index) => {
      if (!originalImage || originalImage?.endsWith(".gif")) {
        updateUrl(originalImage, index);
      } else if(imageCacheRef.current?.[`${originalImage}_${optimizedToWidth}`]) {
        updateUrl(imageCacheRef.current?.[`${originalImage}_${optimizedToWidth}`], index); 
      } else {
        const workerScript = `
          self.onmessage = async (e) => {
            const { imageUrl, optimizedToWidth } = e.data;
            try {
              const response = await fetch(imageUrl);
              if (!response.ok) {
                self.postMessage("");
                return;
              }
              const blob = await response.blob();
              if (!blob.type.startsWith('image/')) {
                self.postMessage("");
                return;
              }
              const img = await createImageBitmap(blob);
              const aspectRatio = img.height / img.width;
              const newHeight = optimizedToWidth * aspectRatio;
              const offscreenCanvas = new OffscreenCanvas(optimizedToWidth, newHeight);
              const ctx = offscreenCanvas.getContext('2d');
              ctx.drawImage(img, 0, 0, optimizedToWidth, newHeight);
              const resizedBlob = await offscreenCanvas.convertToBlob();
              self.postMessage(resizedBlob);
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
          if (blob) {
            const url = URL.createObjectURL(blob);
            setImageCache(prevState => ({...prevState, [`${originalImage}_${optimizedToWidth}`]: url }));
            updateUrl(url, index);
          } else {
            setImageCache(prevState => ({...prevState, [`${originalImage}_${optimizedToWidth}`]: "/default.png" }));
            updateUrl("/default.png", index); // Handle error or empty response
          }
        };
        worker.postMessage({ imageUrl: originalImage, optimizedToWidth });

        // Clean up
        return () => {
          worker.terminate();
        };
      }
    });
  }, [originalImages, optimizedToWidth, setImageCache]); // Depend on the array of images

  return resizedImageUrls;
};

export default useMultiImageOptimizer;