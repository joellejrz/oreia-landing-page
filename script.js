(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // ========== MOUSE STATE ==========
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  document.addEventListener('mouseleave', () => { mouse.active = false; });

  // ========== CURSOR GLOW ==========
  if (!isMobile && !prefersReducedMotion) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let glowX = mouse.x, glowY = mouse.y;

    function updateGlow() {
      glowX += (mouse.x - glowX) * 0.08;
      glowY += (mouse.y - glowY) * 0.08;
      glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
      glow.style.opacity = mouse.active ? '1' : '0';
      requestAnimationFrame(updateGlow);
    }
    updateGlow();
  }

  // ========== PARTICLE CANVAS (mouse-reactive) ==========
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const density = isMobile ? 25000 : 16000;
    const count = Math.floor((canvas.width * canvas.height) / density);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: 0,
        baseY: 0,
        size: Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 25 : 15,
        vx: 0,
        vy: 0,
      });
    }
    particles.forEach(p => { p.baseX = p.x; p.baseY = p.y; });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mouseInfluence = 120;
    const pushStrength = 0.8;

    for (const p of particles) {
      p.baseX += p.speedX;
      p.baseY += p.speedY;

      if (p.baseX < 0) p.baseX = canvas.width;
      if (p.baseX > canvas.width) p.baseX = 0;
      if (p.baseY < 0) p.baseY = canvas.height;
      if (p.baseY > canvas.height) p.baseY = 0;

      if (mouse.active && !isMobile) {
        const dx = p.baseX - mouse.x;
        const dy = p.baseY - (mouse.y + window.scrollY % canvas.height);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseInfluence) {
          const force = (1 - dist / mouseInfluence) * pushStrength;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      p.vx *= 0.92;
      p.vy *= 0.92;
      p.x = p.baseX + p.vx;
      p.y = p.baseY + p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`;
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      createParticles();
    }, 200);
  });

  // ========== NAV SCROLL ==========
  const nav = document.querySelector('.nav');

  function checkScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // ========== MOBILE MENU ==========
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ========== SCROLL REVEAL (spring-based, directional) ==========
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ========== 3D TILT ON CARDS ==========
  if (!isMobile && !prefersReducedMotion) {
    const tiltEls = document.querySelectorAll('[data-tilt]');

    tiltEls.forEach(el => {
      const intensity = parseFloat(el.dataset.tiltIntensity || '10');
      let currentRotateX = 0, currentRotateY = 0;
      let targetRotateX = 0, targetRotateY = 0;
      let tiltFrame;

      function animateTilt() {
        currentRotateX += (targetRotateX - currentRotateX) * 0.1;
        currentRotateY += (targetRotateY - currentRotateY) * 0.1;

        if (Math.abs(targetRotateX - currentRotateX) > 0.01 ||
            Math.abs(targetRotateY - currentRotateY) > 0.01) {
          el.style.transform = `perspective(600px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
          tiltFrame = requestAnimationFrame(animateTilt);
        } else {
          el.style.transform = `perspective(600px) rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
        }
      }

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        targetRotateX = (0.5 - y) * intensity;
        targetRotateY = (x - 0.5) * intensity;
        cancelAnimationFrame(tiltFrame);
        tiltFrame = requestAnimationFrame(animateTilt);
      });

      el.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
        cancelAnimationFrame(tiltFrame);
        tiltFrame = requestAnimationFrame(animateTilt);
      });
    });
  }

  // ========== MAGNETIC BUTTONS ==========
  if (!isMobile && !prefersReducedMotion) {
    const magneticEls = document.querySelectorAll('[data-magnetic]');

    magneticEls.forEach(el => {
      let magX = 0, magY = 0;
      let targetX = 0, targetY = 0;
      let magFrame;

      function animateMag() {
        magX += (targetX - magX) * 0.15;
        magY += (targetY - magY) * 0.15;

        if (Math.abs(targetX - magX) > 0.1 || Math.abs(targetY - magY) > 0.1) {
          el.style.transform = `translate(${magX}px, ${magY}px)`;
          magFrame = requestAnimationFrame(animateMag);
        } else {
          el.style.transform = `translate(${targetX}px, ${targetY}px)`;
        }
      }

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        targetX = dx * 0.25;
        targetY = dy * 0.25;
        cancelAnimationFrame(magFrame);
        magFrame = requestAnimationFrame(animateMag);
      });

      el.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        cancelAnimationFrame(magFrame);
        magFrame = requestAnimationFrame(animateMag);
      });
    });
  }

  // ========== TEXT SCRAMBLE (hero gradient text) ==========
  if (!prefersReducedMotion) {
    const scrambleEl = document.querySelector('[data-text-scramble]');
    if (scrambleEl) {
      const originalText = scrambleEl.textContent;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let frame = 0;
      const totalFrames = 30;

      scrambleEl.textContent = '';

      const scrambleObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          runScramble();
          scrambleObserver.disconnect();
        }
      }, { threshold: 0.5 });

      scrambleObserver.observe(scrambleEl);

      function runScramble() {
        function tick() {
          frame++;
          const progress = frame / totalFrames;
          let output = '';

          for (let i = 0; i < originalText.length; i++) {
            if (originalText[i] === ' ') {
              output += ' ';
            } else if (i < originalText.length * progress) {
              output += originalText[i];
            } else {
              output += chars[Math.floor(Math.random() * chars.length)];
            }
          }

          scrambleEl.textContent = output;

          if (frame < totalFrames) {
            requestAnimationFrame(tick);
          } else {
            scrambleEl.textContent = originalText;
          }
        }
        tick();
      }
    }
  }

  // ========== PARALLAX SECTIONS ==========
  if (!isMobile && !prefersReducedMotion) {
    const parallaxEls = document.querySelectorAll('[data-parallax]');

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax || '0.1');
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const offset = (window.innerHeight / 2 - centerY) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // ========== SMOOTH ANCHOR SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== CONSTELLATION MOUSE INTERACTION ==========
  if (!isMobile && !prefersReducedMotion) {
    const stars = document.querySelectorAll('.star');
    const constellation = document.querySelector('.constellation');

    if (constellation) {
      constellation.addEventListener('mousemove', (e) => {
        const rect = constellation.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        stars.forEach(star => {
          const sx = parseFloat(star.style.getPropertyValue('--x'));
          const sy = parseFloat(star.style.getPropertyValue('--y'));
          const starX = (sx / 100) * rect.width;
          const starY = (sy / 100) * rect.height;
          const dx = mx - starX;
          const dy = my - starY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 15;
            const moveX = -(dx / dist) * force;
            const moveY = -(dy / dist) * force;
            star.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + (1 - dist / maxDist)})`;
          }
        });
      });

      constellation.addEventListener('mouseleave', () => {
        stars.forEach(star => {
          star.style.transform = '';
        });
      });
    }
  }
})();
