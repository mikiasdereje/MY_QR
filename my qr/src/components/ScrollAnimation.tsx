import React, { useEffect, useRef } from 'react';

const frameCount1 = 236;
const frameCount2 = 240;
const totalFrameCount = frameCount1 + frameCount2;

const getFramePath = (index: number) => {
  if (index <= frameCount1) {
    return `/frames1/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
  } else {
    const finalIndex = index - frameCount1;
    return `/frames2/ezgif-frame-${finalIndex.toString().padStart(3, '0')}.jpg`;
  }
};

const ScrollAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Preload
    for (let i = 1; i <= totalFrameCount; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      imagesRef.current.push(img);
    }

    const updateCanvas = (index: number) => {
      const roundedIndex = Math.round(index);
      const img = imagesRef.current[roundedIndex];
      if (!img || !img.complete) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
    };

    let targetFrameIndex = 0;
    let currentFrameIndex = 0;
    const smoothing = 0.1;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / (maxScrollTop || 1);
      targetFrameIndex = Math.min(
        totalFrameCount - 1,
        scrollFraction * (totalFrameCount - 1)
      );
    };

    const animate = () => {
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * smoothing;
      updateCanvas(currentFrameIndex);
      requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll);
    
    const start = () => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        updateCanvas(0);
        animate();
    };

    if (imagesRef.current[0]) {
        imagesRef.current[0].onload = start;
        if (imagesRef.current[0].complete) start();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      id="animation-background-layer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        backgroundColor: 'black'
      }}
    >
      <canvas 
        ref={canvasRef}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};

export default ScrollAnimation;
