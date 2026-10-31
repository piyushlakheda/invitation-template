/**
 * Audio Controller for Harshita & Akash's Engagement Invitation
 * Track: JVKE - "her" (JVKE_-_her_(mp3.pm)-[AudioTrimmer.com].mp3)
 * Handles modern browser Autoplay policies seamlessly
 */

class AudioController {
  constructor() {
    this.audio = document.getElementById('bgAudio') || new Audio('JVKE_-_her_(mp3.pm)-[AudioTrimmer.com].mp3');
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 0.75;

    this.isPlaying = false;
    this.isMutedByUser = false;
    this.toggleBtn = document.getElementById('musicToggle');
    this.soundPrompt = null;

    this.init();
  }

  init() {
    // 1. Toggle Button Handler
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isPlaying) {
          this.isMutedByUser = true;
          this.pause();
        } else {
          this.isMutedByUser = false;
          this.play();
        }
      });
    }

    // 2. Track playback state events
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI(true);
      this.hidePrompt();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI(false);
    });

    // 3. Attempt Autoplay immediately on load
    this.tryPlay();

    // 4. Capture any user activation gesture (pointerdown, touchstart, scroll, etc.)
    const gestureEvents = ['pointerdown', 'touchstart', 'mousedown', 'touchend', 'click', 'keydown', 'wheel', 'scroll'];
    const handleGesture = () => {
      if (!this.isPlaying && !this.isMutedByUser) {
        this.play();
      }
    };

    gestureEvents.forEach(evt => {
      window.addEventListener(evt, handleGesture, { passive: true });
    });
  }

  tryPlay() {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updateUI(true);
        })
        .catch(() => {
          // Autoplay with sound was blocked by browser security policy.
          // Show subtle prompt so user knows music is waiting.
          this.isPlaying = false;
          this.updateUI(true);
          this.showPrompt();
        });
    }
  }

  play() {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updateUI(true);
          this.hidePrompt();
        })
        .catch((err) => {
          console.log('Audio gesture waiting:', err);
        });
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI(false);
  }

  updateUI(playing) {
    if (!this.toggleBtn) return;
    if (playing) {
      this.toggleBtn.classList.add('playing');
      this.toggleBtn.setAttribute('aria-label', 'Mute Music');
      const textSpan = this.toggleBtn.querySelector('span:not(.sound-bar)');
      if (textSpan) textSpan.textContent = 'Mute';
    } else {
      this.toggleBtn.classList.remove('playing');
      this.toggleBtn.setAttribute('aria-label', 'Play Music');
      const textSpan = this.toggleBtn.querySelector('span:not(.sound-bar)');
      if (textSpan) textSpan.textContent = 'Music';
    }
  }

  showPrompt() {
    if (this.soundPrompt || this.isPlaying) return;
    this.soundPrompt = document.createElement('div');
    this.soundPrompt.id = 'soundPromptBanner';
    this.soundPrompt.innerHTML = `<span>Tap anywhere to enable music</span>`;
    this.soundPrompt.style.cssText = `
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(20, 2, 6, 0.75);
      border: 1px solid rgba(212, 175, 55, 0.45);
      color: #F7E5B5;
      padding: 6px 18px;
      border-radius: 30px;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-family: 'Montserrat', sans-serif;
      font-weight: 300;
      backdrop-filter: blur(10px);
      z-index: 1000;
      pointer-events: none;
      animation: pulseBanner 2.5s infinite ease-in-out;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(this.soundPrompt);

    // Style animation
    if (!document.getElementById('soundBannerStyle')) {
      const style = document.createElement('style');
      style.id = 'soundBannerStyle';
      style.textContent = `
        @keyframes pulseBanner {
          0%, 100% { opacity: 0.85; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.03); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  hidePrompt() {
    if (this.soundPrompt) {
      this.soundPrompt.remove();
      this.soundPrompt = null;
    }
  }
}

// Global instance
window.audioController = new AudioController();
