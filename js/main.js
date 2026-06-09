/* ============================================================
   Modern Furniture & Mattresses — main.js
   - Smooth scroll (CSS handles most, JS polyfill for old browsers)
   - Sticky header shadow on scroll
   - Mobile hamburger toggle
   - Fade-in animation via IntersectionObserver
   - Active nav link highlight
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navbar ---- */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveSection();
  });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Smooth Scroll (fallback for browsers without CSS smooth-scroll) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      // Scroll past section headers directly to content
      const contentMap = {
        '#departments': '.dept-grid',
        '#about':       '.about-grid',
        '#blog':        '.blog-grid',
        '#contact':     '.contact-grid',
      };
      const scrollTarget = contentMap[targetId]
        ? document.querySelector(contentMap[targetId]) || document.querySelector(targetId)
        : document.querySelector(targetId);

      if (scrollTarget) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = scrollTarget.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightActiveSection() {
    const scrollY = window.scrollY + (navbar ? navbar.offsetHeight + 20 : 80);
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionH = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionH) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  /* ---- Fade-in on Scroll (IntersectionObserver) ---- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12 }
    );

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Hero Slider ---- */
  const slidesWrapper = document.querySelector('.slides-wrapper');
  const slides        = document.querySelectorAll('.slide');
  const dots          = document.querySelectorAll('.slider-dot');
  const prevBtn       = document.querySelector('.slider-prev');
  const nextBtn       = document.querySelector('.slider-next');
  const counterEl     = document.querySelector('.slider-counter span');

  if (slidesWrapper && slides.length) {
    let current = 0;
    let autoplayTimer;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
      slidesWrapper.style.transform = `translateX(-${current * 100}%)`;
      if (counterEl) counterEl.textContent = current + 1;
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    });

    // Swipe support (touch devices)
    let touchStartX = 0;
    slidesWrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slidesWrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAutoplay(); }
    });

    // Pause on hover
    slidesWrapper.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    slidesWrapper.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  /* ---- Contact Form ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const res = await fetch('https://formspree.io/f/mdawewgl', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#2a7a2a';
        form.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      } else {
        btn.textContent = 'Failed — Try Again';
        btn.style.background = '#c0392b';
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  /* ---- Year in footer ---- */
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
