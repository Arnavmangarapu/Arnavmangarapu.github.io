/* Integration of existing animation libraries. Sources and versions: ANIMATION-SOURCES.md. */
(() => {
  'use strict';
  const root = document.documentElement;
  const { gsap, ScrollTrigger, SplitText, Lenis, MouseFollower } = window;
  if (!gsap || !ScrollTrigger || !SplitText || !window.PortfolioSplitText) {
    root.classList.remove('motion-pending');
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const navigation = document.querySelector('#navigation');
  const dialog = document.querySelector('#project-dialog');
  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  navigation.append(indicator);
  const progress = document.createElement('span');
  progress.className = 'header-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.querySelector('.site-header').append(progress);
  let motionContext, fontsReady = false, requested = false;

  // A single GSAP tween moves the same marker; no separate per-link indicators.
  const placeIndicator = (immediate = false) => {
    const active = navigation.querySelector('[aria-current="location"]');
    if (!active || !navigation.getClientRects().length) return;
    const parent = navigation.getBoundingClientRect(), rect = active.getBoundingClientRect();
    const reduced = root.classList.contains('motion-off');
    gsap.to(indicator, {
      x: rect.left - parent.left - 10, y: rect.top - parent.top,
      width: rect.width + 20, height: rect.height, opacity: 1,
      duration: immediate || reduced ? 0 : .65, ease: 'power3.inOut', overwrite: true
    });
  };
  document.addEventListener('portfolio:sectionchange', () => placeIndicator());
  new ResizeObserver(() => placeIndicator(true)).observe(navigation);
  new MutationObserver(() => placeIndicator(true)).observe(navigation, { attributes: true, attributeFilter: ['class'] });
  placeIndicator(true);

  const startMotion = () => {
    if (motionContext || !fontsReady || !requested) return;
    root.classList.add('motion-enhanced');
    motionContext = gsap.context(() => {
      const abort = new AbortController();
      const listen = (node, event, handler, options = {}) => node.addEventListener(event, handler, { ...options, signal: abort.signal });
      const splits = [];
      const reveal = (element, options) => splits.push(window.PortfolioSplitText(element, options));
      let lenis, cursor;
      const tick = time => lenis?.raf(time * 1000);
      if (Lenis) {
        // Same duration and exponential easing as the Onseis reference.
        lenis = new Lenis({ duration: 1.8, lerp: 0, smoothWheel: true, syncTouch: false, anchors: false, stopInertiaOnNavigate: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        // Route native anchor clicks through Lenis without a competing browser jump.
        listen(document, 'click', event => {
          const link = event.target.closest('a[href^="#"]');
          if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const target = document.getElementById(link.hash.slice(1));
          if (!target) return;
          event.preventDefault();
          if (location.hash !== link.hash) history.pushState(null, '', link.hash);
          lenis.scrollTo(target, { onComplete: () => {
            if (event.detail === 0) {
              target.setAttribute('tabindex', '-1');
              target.focus({ preventScroll: true });
            }
          } });
        });
      }
      if (MouseFollower && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        cursor = new MouseFollower({ speed: .55, ease: 'expo.out', skewing: 0, skewingText: 0, stickDelta: .15, visible: true, hideOnLeave: true });
        cursor.el.setAttribute('aria-hidden', 'true');
        document.querySelectorAll('.split-button,.contact-arrow').forEach(el => el.setAttribute('data-cursor-stick', ''));
        document.querySelectorAll('.project-art-open').forEach(el => el.setAttribute('data-cursor-text', 'View ↗'));
        document.querySelector('.contact-arrow').setAttribute('data-cursor-text', 'Say hi');
        listen(document, 'pointermove', e => { if (e.pointerType === 'mouse') root.classList.add('cursor-ready'); }, { passive: true });
        listen(document, 'keydown', e => { if (e.key === 'Tab') root.classList.remove('cursor-ready'); });
      }
      const syncDialog = () => {
        root.classList.toggle('dialog-open', dialog.open);
        if (dialog.open) { lenis?.stop(); cursor?.hide(); }
        else { lenis?.start(); cursor?.show(); }
      };
      const dialogObserver = new MutationObserver(syncDialog);
      dialogObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] });
      syncDialog();

      // React Bits' rise and blur presets, staggered into a gradual intro.
      reveal(document.querySelector('#hero-title'), { splitType: 'words,chars', trigger: 'load', delay: 27, duration: 1.1, startDelay: .2, mask: true });
      reveal(document.querySelector('.hero-description'), { splitType: 'lines', trigger: 'load', delay: 130, duration: 1, startDelay: .65, effect: 'blur' });
      gsap.from('.hero-top,.hero-role', { opacity: 0, y: 12, duration: .9, stagger: .16, ease: 'power3.out' });
      gsap.from('.hero-art', { opacity: 0, scale: .88, duration: 1.9, ease: 'power2.out', delay: .15 });
      gsap.from('.hero .split-button,.hero-bottom', { opacity: 0, y: 15, duration: .85, stagger: .18, delay: 1.05, ease: 'power3.out' });
      root.classList.remove('motion-pending');

      reveal(document.querySelector('.about-statement'), { splitType: 'words', effect: 'blur', delay: 65, duration: .9 });
      document.querySelectorAll('.projects-heading h2,.section-opening h2,.contact-heading h2').forEach(el => {
        reveal(el, { splitType: 'words,chars', delay: 22, duration: .9, mask: true });
      });
      document.querySelectorAll('.about-bottom>p,.section-opening>p,.contact-bottom>p').forEach(el => {
        reveal(el, { splitType: 'lines', effect: 'blur', delay: 100, duration: .9 });
      });
      document.querySelectorAll('.project').forEach(card => {
        const anchor = document.getElementById(card.id.replace(/-card$/, ''));
        reveal(card.querySelector('h3'), { splitType: 'words,chars', delay: 30, duration: .9, mask: true, triggerElement: anchor, start: 'top 68%' });
        gsap.from(card.querySelector('.visual-frame'), {
          opacity: .3, scale: .94, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: anchor, start: 'top 75%', once: true, fastScrollEnd: true }
        });
      });
      gsap.from('.milestones>div', { opacity: 0, y: 20, duration: .85, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.milestones', start: 'top 90%', once: true } });
      document.querySelectorAll('.skill-row').forEach(row => gsap.from(row, { opacity: 0, y: 15, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 92%', once: true } }));
      gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 } });

      // Preserve document position for browser Back/Forward and project deep links.
      listen(window, 'hashchange', () => {
        const target = document.getElementById(location.hash.slice(1));
        if (target && lenis) lenis.scrollTo(target, { immediate: true });
      });
      const refreshFrame = requestAnimationFrame(() => { lenis?.resize(); ScrollTrigger.refresh(); });
      return () => {
        cancelAnimationFrame(refreshFrame);
        abort.abort();
        dialogObserver.disconnect();
        gsap.ticker.remove(tick);
        lenis?.destroy();
        cursor?.destroy();
        splits.forEach(split => split.revert());
        root.classList.remove('cursor-ready', 'dialog-open', 'motion-pending');
      };
    });
    placeIndicator(true);
  };
  window.PortfolioMotion = {
    setEnabled(enabled) {
      requested = enabled;
      if (enabled) startMotion();
      else {
        motionContext?.revert();
        motionContext = null;
        gsap.killTweensOf(indicator);
        root.classList.remove('motion-enhanced', 'motion-pending');
      }
      placeIndicator(true);
    }
  };
  Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1500))]).then(() => {
    fontsReady = true;
    startMotion();
    root.classList.remove('motion-pending');
  }).catch(() => root.classList.remove('motion-pending'));
})();
