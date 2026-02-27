/* =============================================
   LA PALMA CAFÉ — JAVASCRIPT
   Handles: Navbar scroll, Menu filter tabs,
   Mobile menu, Back-to-top, Active nav links
   ============================================= */

(() => {

  /* ---------- NAVBAR SCROLL EFFECT ---------- */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load


  /* ---------- HAMBURGER / MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = ['hero', 'menu', 'about', 'contact'];
  const navAnchorMap = {};
  sections.forEach(id => {
    const el = document.getElementById(id);
    const anchor = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (el && anchor) navAnchorMap[id] = { el, anchor };
  });

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 100;
    let current = 'hero';
    sections.forEach(id => {
      const { el } = navAnchorMap[id] || {};
      if (el && el.offsetTop <= scrollY) current = id;
    });
    Object.values(navAnchorMap).forEach(({ anchor }) => anchor.classList.remove('active'));
    if (navAnchorMap[current]) navAnchorMap[current].anchor.classList.add('active');
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();





  /* ---------- BACK TO TOP BUTTON ---------- */
  const backToTopBtn = document.getElementById('backToTop');

  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------- INTERSECTION OBSERVER (fade-in sections) ---------- */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animate cards within about/contact sections
  document.querySelectorAll('.feature-item, .contact-card, .about-img-wrapper, .about-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(el);
  });


  /* ---------- SMOOTH LINK ACTIVE DETECTION ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = targetId === 'hero' ? 0 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- HERO IMAGE SEQUENCE SCROLL ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const context = canvas.getContext('2d');
    const heroSection = document.getElementById('hero');

    const frameCount = 80;
    const currentFrame = index => (
      `assets/images/hero-sequence/Smoothly_transition_between_1080p_20260222192_${index.toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    const sequence = { frame: 0 };
    let requestRef;

    // Preload images
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const img = images[sequence.frame];
      if (img && img.complete) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imageWidth = img.width;
        const imageHeight = img.height;

        const ratio = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
        const newWidth = imageWidth * ratio;
        const newHeight = imageHeight * ratio;
        const x = (canvasWidth - newWidth) / 2;
        const y = (canvasHeight - newHeight) / 2;

        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(img, x, y, newWidth, newHeight);
      }
    };

    const updateFrame = () => {
      const wrapper = document.getElementById('hero-scroll-wrapper');
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      // Animation completes when we've scrolled the full extra scroll height
      const maxScroll = wrapper.offsetHeight - window.innerHeight;

      let scrollY = -rect.top;
      if (scrollY < 0) scrollY = 0;
      if (scrollY > maxScroll) scrollY = maxScroll;

      const scrollFraction = maxScroll > 0 ? scrollY / maxScroll : 0;
      const frameIndex = Math.floor(scrollFraction * (frameCount - 1));

      if (sequence.frame !== frameIndex) {
        sequence.frame = frameIndex;
        if (requestRef) cancelAnimationFrame(requestRef);
        requestRef = requestAnimationFrame(render);
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener('scroll', updateFrame, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    // Trigger initial render
    images[0].onload = () => {
      resizeCanvas();
      updateFrame();
    };

    // Fallback for mobile/fast loads
    // Fallback for mobile/fast loads
    setTimeout(() => {
      resizeCanvas();
      updateFrame();
    }, 500);
  }

  /* ---------- BACKGROUND MUSIC ---------- */
  const audio = new Audio('assets/audio/waves.mp3');
  audio.loop = true;
  audio.volume = 0.2; // Calm and relaxing volume (Note: iOS overrides this script volume)

  let isAudioPlaying = false;
  const interactionEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'];

  const startAudio = () => {
    if (isAudioPlaying) return;

    // Attempt to play synchronously with the user action
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        isAudioPlaying = true;
        // Clean up listeners globally
        interactionEvents.forEach(evt => window.removeEventListener(evt, startAudio, { capture: true }));
      }).catch(err => {
        // Playback prevented, typically because the user hasn't explicitly interacted yet
        console.log('Mobile/Safari blocked play – waiting for stricter interaction...', err);
      });
    }
  };

  // Bind broadly to window events to ensure catching mobile taps anywhere on the screen
  interactionEvents.forEach(evt => {
    window.addEventListener(evt, startAudio, { capture: true, passive: true });
  });

})();
