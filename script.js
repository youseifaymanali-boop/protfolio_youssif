/* ============================================
   Portfolio — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initCustomCursor();
  initParticles();
  initScrollReveal();
  initCarousel();
  initSmoothScroll();
});

/* ------------------------------------------
   Dark / Light Mode Toggle
   ------------------------------------------ */
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  });
}

/* ------------------------------------------
   Navbar — Scroll effect, active link, mobile menu
   ------------------------------------------ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  // Shadow on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Highlight active nav link based on scroll position
  function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
}

/* ------------------------------------------
   Custom Cursor Effect
   ------------------------------------------ */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactives = document.querySelectorAll(
    'a, button, .skill-card, .project-card, .service-card, .testimonial-card, .slider-btn, .competency-card, .contact-btn, .education-card'
  );
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ------------------------------------------
   Particle Background — lightweight canvas
   ------------------------------------------ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let width = 0;
  let height = 0;

  const PARTICLE_COUNT = window.innerWidth < 768 ? 35 : 55;
  const CONNECTION_DIST = 120;

  function getParticleColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--particle-color')
      .trim() || 'rgba(87, 85, 254, 0.35)';
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const color = getParticleColor();

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${0.08 * (1 - dist / CONNECTION_DIST)})`);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      draw();
    }
  });
}

/* ------------------------------------------
   Scroll Reveal Animation
   ------------------------------------------ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for grid children
          const parent = entry.target.parentElement;
          const siblings = parent ? [...parent.querySelectorAll('.reveal')] : [];
          const delay = siblings.indexOf(entry.target) * 100;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* ------------------------------------------
   Testimonials Slider — multi-card carousel
   ------------------------------------------ */
function initCarousel() {
  const track = document.getElementById('testimonialTrack');
  const viewport = document.getElementById('sliderViewport');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  const slider = document.querySelector('.testimonial-slider');

  if (!track || !viewport) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const gap = 24;
  let currentIndex = 0;
  let cardsPerView = 1;
  let autoPlayInterval;

  function getCardsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - cardsPerView);
  }

  function getTotalPages() {
    return getMaxIndex() + 1;
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const totalPages = getTotalPages();

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider(animate = true) {
    cardsPerView = getCardsPerView();
    const maxIndex = getMaxIndex();

    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const viewportWidth = viewport.offsetWidth;
    const cardWidth = (viewportWidth - gap * (cardsPerView - 1)) / cardsPerView;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transition = animate
      ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';
    track.style.transform = `translateX(-${offset}px)`;

    cards.forEach(card => {
      card.style.flex = `0 0 ${cardWidth}px`;
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 4500);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  buildDots();
  updateSlider(false);
  startAutoPlay();

  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      updateSlider(false);
    }, 150);
  });

  // Touch / swipe support
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    startAutoPlay();
  }, { passive: true });
}

/* ------------------------------------------
   Smooth Scroll for anchor links
   ------------------------------------------ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
