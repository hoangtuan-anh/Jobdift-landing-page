(function () {
  'use strict';

  /* ── Scroll Reveal ── */
  function revealEl(el) {
    var delay = el.getAttribute('data-reveal-delay');
    if (delay) {
      setTimeout(function () { el.classList.add('revealed'); }, parseInt(delay, 10));
    } else {
      el.classList.add('revealed');
    }
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        revealEl(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Scroll-through on load to trigger IntersectionObserver for all elements
  // (also ensures screenshot tools capture fully-revealed content)
  window.addEventListener('load', function () {
    setTimeout(function () {
      var h = document.documentElement.scrollHeight;
      var step = window.innerHeight;
      var pos = 0;
      function next() {
        pos += step;
        window.scrollTo(0, pos);
        if (pos < h) { requestAnimationFrame(next); }
        else { window.scrollTo(0, 0); }
      }
      requestAnimationFrame(next);
    }, 50);
  });

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var body = document.getElementById(this.getAttribute('aria-controls'));

      // Close all others
      document.querySelectorAll('.faq-toggle').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        var otherBody = document.getElementById(other.getAttribute('aria-controls'));
        if (otherBody) otherBody.classList.remove('open');
      });

      // Toggle current
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        if (body) body.classList.add('open');
      }
    });
  });

  /* ── Lightbox ── */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hasAttribute('hidden')) {
      closeLightbox();
    }
  });

  /* ── Carousel ── */
  var slides = document.querySelectorAll('.carousel-slide');
  var dots = document.querySelectorAll('.carousel-dot');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  var current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  if (slides.length) {
    slides[0].classList.add('active');

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index, 10));
      });
    });

    // Click image to open lightbox
    document.querySelectorAll('.carousel-img').forEach(function (img) {
      img.addEventListener('click', function () {
        openLightbox(this.dataset.src || this.src, this.dataset.alt || this.alt);
      });
    });
  }
})();
