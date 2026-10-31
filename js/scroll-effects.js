/**
 * Minimal Cinematic Scroll Effects & Video Parallax
 * Harshita & Akash Engagement Invitation
 */

document.addEventListener('DOMContentLoaded', () => {
  const scrollProgress = document.getElementById('scrollProgress');
  const bgVideo = document.getElementById('bgVideo');

  // 1. Scroll Progress Bar
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0 && scrollProgress) {
      const progress = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // 2. Video Parallax & Subtle Zoom on Scroll
  const handleVideoParallax = () => {
    if (!bgVideo) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = Math.min(scrollY / (maxScroll || 1), 1);
    
    // Smooth cinematic zoom from 1.02 to 1.12 as user scrolls down
    const scale = 1.02 + ratio * 0.1;
    bgVideo.style.transform = `scale(${scale})`;
  };

  window.addEventListener('scroll', handleVideoParallax, { passive: true });

  // 3. Intersection Observer for Smooth Section Reveals
  const revealElements = document.querySelectorAll('.reveal-fade');
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Auto-reveal first slide immediately
  const firstSlide = document.querySelector('#slide1 .reveal-fade');
  if (firstSlide) {
    setTimeout(() => firstSlide.classList.add('active'), 150);
  }
});
