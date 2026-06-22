const canvas = document.getElementById("animation-canvas");
const context = canvas.getContext("2d");

const frameCount1 = 236;
const frameCount2 = 240;
const totalFrameCount = frameCount1 + frameCount2;

const getFramePath = (index) => {
  if (index <= frameCount1) {
    return `./MYQR%20all%20frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
  } else {
    const finalIndex = index - frameCount1;
    return `./final_fremes/ezgif-frame-${finalIndex.toString().padStart(3, '0')}.jpg`;
  }
};

const images = [];
let targetFrameIndex = 0;
let currentFrameIndex = 0;
const smoothing = 0.08;

// Preload images
const preloadImages = () => {
    for (let i = 1; i <= totalFrameCount; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        images.push(img);
    }
};

const updateCanvas = (index) => {
    const roundedIndex = Math.max(0, Math.min(totalFrameCount - 1, Math.floor(index)));
    const img = images[roundedIndex];
    if (!img || !img.complete) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
};

const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScrollTop = scrollHeight - clientHeight;
    
    const scrollFraction = Math.max(0, Math.min(1, scrollTop / (maxScrollTop || 1)));
    targetFrameIndex = scrollFraction * (totalFrameCount - 1);

    // Header styling on scroll
    const header = document.querySelector('header');
    if (header) {
        if (scrollTop > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
};

function animate() {
    const diff = targetFrameIndex - currentFrameIndex;
    if (Math.abs(diff) > 0.001) {
        currentFrameIndex += diff * smoothing;
        updateCanvas(currentFrameIndex);
    }
    requestAnimationFrame(animate);
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();

    let isAnimating = false;
    const start = () => {
        if (isAnimating) return;
        isAnimating = true;
        updateCanvas(0);
        animate();
    };

    if (images[0]) {
        if (images[0].complete) start();
        else images[0].onload = start;
    }
});

window.addEventListener('resize', handleScroll);
