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
  const navLinks  = document.getElementById('navLinks');

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
  const sections   = ['hero', 'menu', 'about', 'contact'];
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


  /* ---------- MENU FILTER TABS ---------- */
  const tabs      = document.querySelectorAll('.tab-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  const filterMenu = (cat) => {
    menuItems.forEach((item, i) => {
      const itemCat = item.getAttribute('data-cat');
      const show = (cat === 'all' || itemCat === cat);

      if (show) {
        item.classList.remove('hidden');
        // Staggered fade-in animation
        item.style.animationDelay = `${i * 0.04}s`;
        item.classList.remove('entering');
        // Force reflow then re-add class
        void item.offsetWidth;
        item.classList.add('entering');
      } else {
        item.classList.add('hidden');
        item.classList.remove('entering');
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Filter items
      filterMenu(tab.getAttribute('data-cat'));
    });
  });

  // Initialize — show all
  filterMenu('all');


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

})();
