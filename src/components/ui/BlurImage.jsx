import React, { useState, useEffect, useRef } from 'react';

const BlurImage = ({ src, alt, className, ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    // Reset loading state if the source URL changes
    setLoading(true);
  }, [src]);

  // SAFETY CHECK: If image is already in browser cache, onLoad might not fire.
  // We check the 'complete' status immediately on mount to fix the "White Box" bug.
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoading(false);
    }
  }, []);

  return (
    // Wrapper: Handles layout, rounded corners, and external hover effects
    // Used bg-gray-200/20 to be subtle in both Dark and Light modes
    <div className={`relative overflow-hidden bg-gray-200/50 ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async" // Helps prevent scroll jank
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)} // If error, show the broken image instead of white box
        className={`
          w-full h-full object-cover 
          transition-opacity duration-500 ease-out
          ${isLoading ? 'opacity-0' : 'opacity-100'} 
        `}
        {...props}
      />
    </div>
  );
};

export default BlurImage;