/**
 * Main Presentation Logic
 * Handles slide navigation, keyboard controls, and state management
 */

class PresentationController {
  constructor() {
    // Get only visible slides (not hidden with display: none)
    this.allSlides = Array.from(document.querySelectorAll('.slide'));
    this.slides = this.allSlides.filter(slide => {
      // Check inline style attribute
      return slide.style.display !== 'none';
    });
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    
    this.slideNav = document.getElementById('slideNav');
    this.slideCounter = document.getElementById('slideCounter');
    this.prevBtn = document.getElementById('prevSlide');
    this.nextBtn = document.getElementById('nextSlide');
    
    this.init();
  }
  
  init() {
    // Remove active class from all slides and set it only on first visible slide
    this.allSlides.forEach(slide => slide.classList.remove('active'));
    if (this.slides.length > 0) {
      this.slides[0].classList.add('active');
    }
    
    this.buildNavigation();
    this.attachEventListeners();
    this.updateUI();
    this.trackProgress();
  }
  
  buildNavigation() {
    if (!this.slideNav) return;
    
    this.slides.forEach((slide, index) => {
      const title = slide.dataset.title || `Slide ${index + 1}`;
      const navItem = document.createElement('button');
      navItem.className = 'nav-item';
      navItem.textContent = `${index + 1}. ${title}`;
      navItem.addEventListener('click', () => this.goToSlide(index));
      
      if (index === 0) navItem.classList.add('active');
      
      this.slideNav.appendChild(navItem);
    });
  }
  
  attachEventListeners() {
    // Previous button
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    // Next button
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.previousSlide();
      } else if (e.key === 'Home') {
        this.goToSlide(0);
      } else if (e.key === 'End') {
        this.goToSlide(this.totalSlides - 1);
      }
    });
    
    // Touch gestures (swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }
  
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }
  
  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    
    // Remove active class from current slide
    this.slides[this.currentIndex].classList.remove('active');
    const navItems = this.slideNav.querySelectorAll('.nav-item');
    if (navItems[this.currentIndex]) {
      navItems[this.currentIndex].classList.remove('active');
    }
    
    // Update index
    this.currentIndex = index;
    
    // Add active class to new slide
    this.slides[this.currentIndex].classList.add('active');
    if (navItems[this.currentIndex]) {
      navItems[this.currentIndex].classList.add('active');
      navItems[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Scroll to top of the slide content
    const slidesContainer = document.querySelector('.slides');
    if (slidesContainer) {
      slidesContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Update UI
    this.updateUI();
    
    // Save progress
    this.saveProgress();
    
    // Trigger slide-specific initialization
    this.onSlideChange();
  }
  
  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }
  
  previousSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }
  
  updateUI() {
    // Update counter
    if (this.slideCounter) {
      this.slideCounter.textContent = `Slide ${this.currentIndex + 1} / ${this.totalSlides}`;
    }
    
    // Update button states
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
      this.nextBtn.textContent = this.currentIndex === this.totalSlides - 1 ? 'Finish' : 'Next';
    }
  }
  
  onSlideChange() {
    const currentSlide = this.slides[this.currentIndex];
    const slideTitle = currentSlide.dataset.title;
    
    // Trigger custom event for other modules
    window.dispatchEvent(new CustomEvent('slideChange', {
      detail: {
        index: this.currentIndex,
        title: slideTitle,
        slide: currentSlide
      }
    }));
  }
  
  saveProgress() {
    try {
      localStorage.setItem('hipaa_presentation_progress', JSON.stringify({
        currentSlide: this.currentIndex,
        totalSlides: this.totalSlides,
        lastViewed: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Could not save progress:', e);
    }
  }
  
  trackProgress() {
    try {
      const saved = localStorage.getItem('hipaa_presentation_progress');
      if (saved) {
        const progress = JSON.parse(saved);
        const askResume = confirm(`Welcome back! You were on slide ${progress.currentSlide + 1}. Resume from there?`);
        if (askResume && progress.currentSlide > 0) {
          this.goToSlide(progress.currentSlide);
        }
      }
    } catch (e) {
      console.error('Could not load progress:', e);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.presentationController = new PresentationController();
});

// Utility function for other modules to use
window.getCurrentSlide = function() {
  return window.presentationController ? window.presentationController.currentIndex : 0;
};

window.goToSlide = function(index) {
  if (window.presentationController) {
    window.presentationController.goToSlide(index);
  }
};

