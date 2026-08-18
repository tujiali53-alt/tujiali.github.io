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
    const sparkleColors = ['#ffffff', '#ddd4ff', '#c8f2ff', '#ffd9ef'];
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
      if (Math.random() < .22) particle.classList.add('is-star');
      particle.style.left = `${x + (Math.random() - .5) * 12}px`;
      particle.style.top = `${y + (Math.random() - .5) * 12}px`;
      particle.style.setProperty('--size', `${Math.random() * 3.5 + 2}px`);
      particle.style.setProperty('--dx', `${(Math.random() - .5) * 28}px`);
      particle.style.setProperty('--dy', `${-(Math.random() * 24 + 8)}px`);
      particle.style.setProperty('--particle-color', sparkleColors[Math.floor(Math.random() * sparkleColors.length)]);
      hero.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    });
  }

  const worksTitle = document.querySelector('#works-hero-title');
  if (worksTitle && !reducedMotion && matchMedia('(pointer:fine)').matches) {
    const letters = [...worksTitle.querySelectorAll('span')];
    const resetWorksTitle = () => {
      worksTitle.style.setProperty('--title-rotate-x', '0deg');
      worksTitle.style.setProperty('--title-rotate-y', '0deg');
      worksTitle.style.setProperty('--title-scale', '1');
      letters.forEach(letter => {
        letter.style.setProperty('--letter-scale', '1');
        letter.style.setProperty('--letter-lift', '0px');
      });
    };

    worksTitle.addEventListener('pointermove', event => {
      const titleRect = worksTitle.getBoundingClientRect();
      const relativeX = (event.clientX - titleRect.left) / titleRect.width - .5;
      const relativeY = (event.clientY - titleRect.top) / titleRect.height - .5;
      worksTitle.style.setProperty('--title-rotate-x', `${(-relativeY * 6).toFixed(2)}deg`);
      worksTitle.style.setProperty('--title-rotate-y', `${(relativeX * 8).toFixed(2)}deg`);
      worksTitle.style.setProperty('--title-scale', '1.025');

      const influenceRange = Math.max(titleRect.width * .26, 90);
      letters.forEach(letter => {
        const letterRect = letter.getBoundingClientRect();
        const letterCenter = letterRect.left + letterRect.width / 2;
        const influence = Math.max(0, 1 - Math.abs(event.clientX - letterCenter) / influenceRange);
        letter.style.setProperty('--letter-scale', (1 + influence * .2).toFixed(3));
        letter.style.setProperty('--letter-lift', `${(-influence * 8).toFixed(1)}px`);
      });
    });
    worksTitle.addEventListener('pointerleave', resetWorksTitle);
  }

  const worksSubtitle = document.querySelector('.works-hero-subtitle');
  if (worksSubtitle && !reducedMotion && matchMedia('(pointer:fine)').matches) {
    const subtitleLetters = [...worksSubtitle.querySelectorAll('.subtitle-letter')];
    const resetWorksSubtitle = () => {
      worksSubtitle.style.setProperty('--subtitle-rotate-x', '0deg');
      worksSubtitle.style.setProperty('--subtitle-rotate-y', '0deg');
      worksSubtitle.style.setProperty('--subtitle-scale', '1');
      subtitleLetters.forEach(letter => {
        letter.style.setProperty('--subtitle-letter-scale', '1');
        letter.style.setProperty('--subtitle-letter-lift', '0px');
      });
    };

    worksSubtitle.addEventListener('pointermove', event => {
      const subtitleRect = worksSubtitle.getBoundingClientRect();
      const relativeX = (event.clientX - subtitleRect.left) / subtitleRect.width - .5;
      const relativeY = (event.clientY - subtitleRect.top) / subtitleRect.height - .5;
      worksSubtitle.style.setProperty('--subtitle-rotate-x', `${(-relativeY * 6).toFixed(2)}deg`);
      worksSubtitle.style.setProperty('--subtitle-rotate-y', `${(relativeX * 8).toFixed(2)}deg`);
      worksSubtitle.style.setProperty('--subtitle-scale', '1.02');

      const influenceRange = Math.max(subtitleRect.width * .13, 70);
      subtitleLetters.forEach(letter => {
        const letterRect = letter.getBoundingClientRect();
        const letterCenter = letterRect.left + letterRect.width / 2;
        const influence = Math.max(0, 1 - Math.abs(event.clientX - letterCenter) / influenceRange);
        letter.style.setProperty('--subtitle-letter-scale', (1 + influence * .2).toFixed(3));
        letter.style.setProperty('--subtitle-letter-lift', `${(-influence * 8).toFixed(1)}px`);
      });
    });
    worksSubtitle.addEventListener('pointerleave', resetWorksSubtitle);
    window.addEventListener('pointermove', event => {
      if (!worksSubtitle.contains(event.target)) resetWorksSubtitle();
    }, { passive: true });
  }

  const worksHero = document.querySelector('.works-hero');
  if (worksHero && !reducedMotion && matchMedia('(pointer:fine)').matches) {
    const trailBubbles = new Set();
    let lastBubbleAt = 0;

    worksHero.addEventListener('pointermove', event => {
      if (event.timeStamp - lastBubbleAt < 22) return;
      lastBubbleAt = event.timeStamp;
      const heroRect = worksHero.getBoundingClientRect();
      const originX = event.clientX - heroRect.left;
      const originY = event.clientY - heroRect.top;
      const bubbleCount = Math.random() < .32 ? 4 : 3;

      for (let index = 0; index < bubbleCount; index++) {
        if (trailBubbles.size >= 72) {
          const oldestBubble = trailBubbles.values().next().value;
          oldestBubble?.remove();
          trailBubbles.delete(oldestBubble);
        }

        const bubble = document.createElement('i');
        const size = Math.random() * 6.5 + 3.5;
        const drift = (Math.random() - .5) * 42;
        const rise = Math.random() * 46 + 42;
        bubble.className = 'works-pointer-bubble';
        bubble.setAttribute('aria-hidden', 'true');
        bubble.style.left = `${originX + (Math.random() - .5) * 18}px`;
        bubble.style.top = `${originY + (Math.random() - .5) * 14}px`;
        bubble.style.setProperty('--trail-size', `${size.toFixed(1)}px`);
        bubble.style.setProperty('--trail-drift-mid', `${(drift * .68).toFixed(1)}px`);
        bubble.style.setProperty('--trail-rise-mid', `${(-rise * .7).toFixed(1)}px`);
        bubble.style.setProperty('--trail-drift', `${drift.toFixed(1)}px`);
        bubble.style.setProperty('--trail-rise', `${(-rise).toFixed(1)}px`);
        bubble.style.setProperty('--trail-duration', `${(Math.random() * .7 + 1.05).toFixed(2)}s`);
        bubble.style.setProperty('--trail-opacity', (Math.random() * .24 + .64).toFixed(2));
        bubble.style.setProperty('--trail-hue', `${Math.round((Math.random() - .5) * 42)}deg`);
        worksHero.appendChild(bubble);
        trailBubbles.add(bubble);
        bubble.addEventListener('animationend', () => {
          trailBubbles.delete(bubble);
          bubble.remove();
        }, { once: true });
      }
    });
  }

  const homeParticles = document.querySelector('#home-particles');
  if (homeParticles && !reducedMotion && window.tsParticles && window.loadSlim) {
    const compactParticles = window.innerWidth < 720;
    const finePointer = matchMedia('(pointer:fine)').matches;
    window.loadSlim(window.tsParticles)
      .then(() => window.tsParticles.load({
        id: 'home-particles',
        options: {
          fullScreen: { enable: false },
          background: { color: { value: 'transparent' } },
          detectRetina: true,
          fpsLimit: compactParticles ? 40 : 60,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          particles: {
            color: { value: ['#ffffff', '#ddd4ff', '#c8f2ff', '#ffd9ef'] },
            links: { enable: false },
            move: {
              enable: true,
              direction: 'none',
              random: true,
              speed: { min: .12, max: compactParticles ? .34 : .48 },
              straight: false,
              outModes: { default: 'out' }
            },
            number: { value: compactParticles ? 34 : 68 },
            opacity: {
              value: { min: .18, max: .72 },
              animation: { enable: true, speed: .65, sync: false }
            },
            shape: { type: 'circle' },
            size: {
              value: { min: 1, max: compactParticles ? 3.2 : 4.4 },
              animation: { enable: true, speed: 1.1, sync: false }
            }
          },
          interactivity: {
            detectsOn: 'window',
            events: {
              onClick: { enable: false },
              onHover: { enable: finePointer, mode: ['grab', 'bubble', 'repulse'] },
              resize: true
            },
            modes: {
              bubble: { distance: 130, duration: 1.4, opacity: .88, size: 7.6 },
              grab: { distance: 165, links: { color: '#e9f5ff', opacity: .28 } },
              repulse: { distance: 68, duration: .35 }
            }
          }
        }
      }))
      .then(() => homeParticles.classList.add('is-ready'))
      .catch(() => homeParticles.classList.add('is-unavailable'));
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const openLightbox = source => {
    if (!lightbox || !lightboxImage || !source) return;
    lightboxImage.src = source.src;
    lightboxImage.alt = source.alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const source = item.querySelector('img');
      openLightbox(source);
    });
  });

  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
    const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    const currentLabel = gallery.querySelector('[data-gallery-current]');
    const totalLabel = gallery.querySelector('[data-gallery-total]');
    if (!slides.length) return;

    let activeIndex = 0;
    const normalize = index => (index + slides.length) % slides.length;
    const showSlide = (nextIndex, direction = 1) => {
      activeIndex = normalize(nextIndex);
      const previousIndex = normalize(activeIndex - 1);
      const nextVisibleIndex = normalize(activeIndex + 1);
      gallery.dataset.direction = direction < 0 ? 'previous' : 'next';

      slides.forEach((slide, index) => {
        const isCurrent = index === activeIndex;
        slide.classList.toggle('is-current', isCurrent);
        slide.classList.toggle('is-prev', index === previousIndex);
        slide.classList.toggle('is-next', index === nextVisibleIndex);
        slide.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
        slide.tabIndex = isCurrent ? 0 : -1;
      });

      thumbs.forEach((thumb, index) => {
        const isActive = index === activeIndex;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-pressed', String(isActive));
      });

      if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
      if (totalLabel) totalLabel.textContent = String(slides.length).padStart(2, '0');
    };

    previous?.addEventListener('click', () => showSlide(activeIndex - 1, -1));
    next?.addEventListener('click', () => showSlide(activeIndex + 1, 1));
    thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => {
      const direction = index < activeIndex ? -1 : 1;
      showSlide(index, direction);
    }));
    slides.forEach(slide => slide.addEventListener('click', () => openLightbox(slide.querySelector('img'))));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showSlide(activeIndex - 1, -1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(activeIndex + 1, 1);
      }
    });

    showSlide(0);
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
