(() => {
  const root = document.documentElement;
  const page = document.body.dataset.page;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  window.addEventListener('load', () => {
    window.setTimeout(() => document.querySelector('.page-loader')?.classList.add('is-done'), reducedMotion ? 0 : 650);
  });

  document.querySelectorAll(`[data-nav="${page}"]`).forEach(link => link.classList.add('is-active'));

  const topbar = document.querySelector('.topbar');
  const updateTopbar = () => topbar?.classList.toggle('is-scrolled', window.scrollY > 16);
  updateTopbar();
  window.addEventListener('scroll', updateTopbar, { passive: true });

  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = url.href; }, reducedMotion ? 0 : 210);
    });
  });

  const hero = document.querySelector('.hero');
  const glow = document.querySelector('.hero-glow');
  if (hero && glow && !reducedMotion && matchMedia('(pointer:fine)').matches) {
    let lastParticleAt = 0;
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      if (event.timeStamp - lastParticleAt < 28) return;
      lastParticleAt = event.timeStamp;
      const particle = document.createElement('i');
      particle.className = 'mouse-particle';
      particle.style.left = `${x + (Math.random() - .5) * 12}px`;
      particle.style.top = `${y + (Math.random() - .5) * 12}px`;
      particle.style.setProperty('--size', `${Math.random() * 3.5 + 2}px`);
      particle.style.setProperty('--dx', `${(Math.random() - .5) * 28}px`);
      particle.style.setProperty('--dy', `${Math.random() * 20 + 8}px`);
      hero.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    });
  }

  const canvas = document.querySelector('.particle-canvas');
  if (canvas && !reducedMotion) {
    const context = canvas.getContext('2d');
    let particles = [];
    let width = 0;
    let height = 0;
    const reset = () => {
      const scale = Math.min(devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * scale;
      canvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const count = width < 700 ? 26 : 54;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + .7,
        vx: (Math.random() - .5) * .18,
        vy: (Math.random() - .5) * .18,
        a: Math.random() * .45 + .12
      }));
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      const dark = root.dataset.theme === 'dark';
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        context.beginPath();
        context.shadowColor = 'rgba(255,255,255,.75)';
        context.shadowBlur = 7;
        context.fillStyle = `rgba(255,255,255,${dark ? particle.a * 1.25 : particle.a * .92})`;
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
        for (let j = index + 1; j < particles.length; j++) {
          const other = particles[j];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 105) {
            context.beginPath();
            context.shadowBlur = 0;
            context.strokeStyle = `rgba(255,255,255,${(1 - distance / 105) * (dark ? .12 : .1)})`;
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };
    reset();
    draw();
    window.addEventListener('resize', reset);
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      const source = item.querySelector('img');
      lightboxImage.src = source.src;
      lightboxImage.alt = source.alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  const videoModal = document.querySelector('.video-modal');
  document.querySelectorAll('[data-video-open]').forEach(button => button.addEventListener('click', () => {
    videoModal?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }));

  const closeModal = modal => {
    modal?.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.modal-close').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.lightbox, .video-modal'))));
  document.querySelectorAll('.lightbox, .video-modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); }));
  window.addEventListener('keydown', event => { if (event.key === 'Escape') document.querySelectorAll('.is-open').forEach(closeModal); });

  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

  const tocLinks = [...document.querySelectorAll('.page-toc a')];
  const tocSections = [...document.querySelectorAll('[data-toc]')];
  if (tocLinks.length && tocSections.length) {
    const setActive = id => {
      tocLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    };
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .25, .6] });
    tocSections.forEach(section => observer.observe(section));
    tocLinks.forEach(link => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('href')?.slice(1);
        if (id) setActive(id);
      });
    });
  }

  document.querySelectorAll('.work-video video').forEach(video => {
    const stage = video.parentElement;
    const fail = () => stage?.classList.add('is-empty');
    video.addEventListener('error', fail);
    video.querySelector('source')?.addEventListener('error', fail);
  });
})();
