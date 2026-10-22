/*
 * React Bits SplitText — DOM adaptation for this static portfolio.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause.
 * Source: https://github.com/DavidHDev/react-bits/blob/main/src/content/TextAnimations/SplitText/SplitText.jsx
 * Full license: reactbits-LICENSE.md
 * Retains the component's GSAP SplitText, stagger, blur/rise presets,
 * onSplit lifecycle and one-time ScrollTrigger reveal. React lifecycle and
 * unused looping/hover modes are omitted; content remains in existing HTML.
 */
window.PortfolioSplitText = (element, {
  splitType = 'chars', delay = 35, duration = 1.05,
  effect = 'rise', trigger = 'view', startDelay = 0,
  start = 'top 87%', mask = false, triggerElement = element
} = {}) => {
  const { gsap, SplitText } = window;
  const accessibleCopy = element.cloneNode(true);
  accessibleCopy.querySelectorAll('br').forEach(br => br.replaceWith(' '));
  accessibleCopy.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove());
  const accessibleName = accessibleCopy.textContent.replace(/\s+/g, ' ').trim();
  const em = parseFloat(getComputedStyle(element).fontSize) || 16;
  const look = effect === 'blur'
    ? { from: { opacity: 0, filter: `blur(${Math.round(em * 1.4) / 10}px)` }, to: { opacity: 1, filter: 'blur(0px)' }, ease: 'power2.out' }
    : { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 }, ease: 'power3.out' };
  const unit = splitType.includes('chars') ? 'chars' : splitType.includes('words') ? 'words' : 'lines';
  let revealed = false;
  return new SplitText(element, {
    type: splitType,
    smartWrap: true,
    autoSplit: splitType === 'lines',
    mask: mask ? unit : undefined,
    linesClass: 'split-line', wordsClass: 'split-word', charsClass: 'split-char',
    reduceWhiteSpace: false,
    aria: 'auto',
    onSplit: self => {
      element.setAttribute('aria-label', accessibleName);
      if (revealed) return;
      const pieces = [self[unit], self.chars, self.words, self.lines].find(list => list.length) || [];
      return gsap.fromTo(pieces,
        { ...look.from, willChange: 'transform, opacity' },
        {
          ...look.to, duration, delay: startDelay, ease: look.ease,
          stagger: gsap.utils.distribute({ each: delay / 1000, from: 'start' }),
          scrollTrigger: trigger === 'load' ? undefined : { trigger: triggerElement, start, once: true, fastScrollEnd: true },
          onComplete: () => {
            revealed = true;
            gsap.set(pieces, { clearProps: 'transform,filter,willChange' });
          }
        }
      );
    }
  });
};
