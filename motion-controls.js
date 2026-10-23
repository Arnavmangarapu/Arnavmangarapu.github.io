// A remembered low-motion mode. Animation packages are loaded only when enabled.
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('#motion-toggle');
  const label = toggle.querySelector('.motion-label');
  const status = document.querySelector('#motion-status');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let preference = 'on', loading, enabled = false;
  try { preference = localStorage.getItem('portfolio-motion') || 'on'; } catch {}
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = false;
    script.src = src + '?v=20261023-fast';
    script.onload = resolve;
    script.onerror = () => { script.remove(); reject(new Error('Animation script unavailable')); };
    document.head.append(script);
  });
  const loadAnimations = () => loading ||= (async () => {
    const scripts = document.body.classList.contains('project-page')
      ? ['gsap.min.js', 'lenis.min.js', 'animations.js']
      : ['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js', 'lenis.min.js', ...(matchMedia('(hover: hover) and (pointer: fine)').matches ? ['mouse-follower.min.js'] : []), 'reactbits-splittext.js', 'animations.js'];
    // Fetch in parallel; async=false preserves dependency execution order.
    await Promise.all(scripts.map(loadScript));
  })();
  const apply = async (announce = false, enhance = true) => {
    enabled = preference !== 'off' && !systemMotion.matches;
    root.classList.toggle('motion-off', !enabled);
    root.dataset.motion = enabled ? 'on' : 'off';
    toggle.setAttribute('aria-checked', String(enabled));
    toggle.disabled = systemMotion.matches;
    label.textContent = enabled ? 'Motion on' : 'Motion off';
    toggle.title = systemMotion.matches ? 'Reduced motion is enabled in your device settings.' : enabled ? 'Turn off animations for a lighter experience' : 'Turn on animations';
    if (announce) status.textContent = enabled ? 'Animations enabled.' : 'Animations off. Lightweight mode enabled.';
    if (!enabled) {
      root.classList.remove('motion-pending');
      window.PortfolioMotion?.setEnabled(false);
      return;
    }
    if (!enhance) return;
    toggle.setAttribute('aria-busy', 'true');
    try {
      await loadAnimations();
      window.PortfolioMotion?.setEnabled(enabled);
    } catch {
      enabled = false;
      root.classList.add('motion-off');
      root.classList.remove('motion-pending');
      root.dataset.motion = 'off';
      toggle.setAttribute('aria-checked', 'false');
      label.textContent = 'Motion off';
      toggle.title = 'Try enabling animations again';
      status.textContent = 'Animations could not load. The portfolio is ready in lightweight mode.';
      loading = null;
    } finally {
      toggle.removeAttribute('aria-busy');
    }
  };
  toggle.addEventListener('click', () => {
    preference = enabled ? 'off' : 'on';
    try { localStorage.setItem('portfolio-motion', preference); } catch {}
    apply(true);
  });
  systemMotion.addEventListener('change', () => apply(true));
  apply(false, false);
  // Paint readable content before optional enhancement work.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => apply(), { timeout: 1200 });
    else setTimeout(() => apply(), 0);
  }));
})();
