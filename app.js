(() => {
  'use strict';
  const data = window.portfolio;
  const $ = selector => document.querySelector(selector);
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => {
    if (!value) return null;
    try { const u = new URL(value, location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; }
  };
  const visuals = window.projectVisuals;
  const total = data.projects.length;
  $('#project-list').innerHTML = data.projects.map((p, index) => {
    const repo = safeURL(p.repository);
    const image = safeURL(p.image);
    const next = data.projects[index + 1];
    return `<div class="project-anchor" id="${escapeHTML(p.id)}"></div><article class="project" style="--project-bg:${['#172b22','#1b302e','#1d292a'][index % 3]}" id="${escapeHTML(p.id)}-card" aria-labelledby="${escapeHTML(p.id)}-title"><div class="project-content"><div class="project-meta"><span class="project-count">${String(index + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span><span>${escapeHTML(p.year)} / ${escapeHTML(p.category)}</span></div><h3 id="${escapeHTML(p.id)}-title"><a href="${escapeHTML(p.id)}.html" aria-label="${escapeHTML(p.title)} project details">${escapeHTML(p.title)}</a></h3><p class="project-headline">${escapeHTML(p.headline)}</p><p class="project-description">${escapeHTML(p.description)}</p><div class="project-tags">${p.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div><div class="project-actions"><a class="project-details-link" href="${escapeHTML(p.id)}.html">Explore project <span aria-hidden="true">↗</span></a>${repo ? `<a href="${escapeHTML(repo)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}</div><div class="project-foot">Keep scrolling to explore <a href="#${next ? escapeHTML(next.id) : 'experience'}">${next ? 'Next project ↓' : 'Experience ↓'}</a></div></div><div class="project-art"><div class="visual-frame"><div class="visual-grid"></div><span class="illustration-label">${image ? 'Project image' : 'Interactive project diagram'}</span>${image ? `<img class="custom-project-image" src="${escapeHTML(image)}" alt="${escapeHTML(p.title)} project" loading="lazy">` : visuals[p.visual] || visuals.security}<div class="visual-caption"><span>${escapeHTML(p.category)}</span><a href="${escapeHTML(p.id)}.html">Full project ↗</a></div></div></div></article>`;
  }).join('');
  $('#skill-list').innerHTML = data.skills.map(([label,tags]) => `<div class="skill-row"><h3>${escapeHTML(label)}</h3><div class="skill-tags">${tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div></div>`).join('');
  window.initProjectVisuals();
  const toggle = $('.menu-toggle'), navigation = $('#navigation');
  const closeMenu = () => {navigation.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');};
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');navigation.classList.toggle('is-open',open);});
  navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e=>{if(e.key==='Escape')closeMenu();});
  const sections = ['profile','projects','experience','skills','contact'].map(id=>document.getElementById(id));
  let queued = false;
  let activeSection;
  const updateNav = () => {
    const point = innerHeight * .4;
    let current = sections[0].id;
    for(const section of sections)if(section.getBoundingClientRect().top<=point)current=section.id;
    navigation.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    if (current !== activeSection) {
      activeSection = current;
      document.dispatchEvent(new CustomEvent('portfolio:sectionchange', { detail: { id: current } }));
    }
    queued=false;
  };
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateNav);}},{passive:true});
  updateNav();
  // Project anchors stay in normal document flow while cards stick during scrolling.
  const initialHash = location.hash.slice(1);
  if (data.projects.some(project => project.id === initialHash)) {
    document.fonts.ready.then(() => {
      if (location.hash.slice(1) === initialHash) document.getElementById(initialHash)?.scrollIntoView({behavior: 'instant'});
    });
  }
  $('#copy-email').addEventListener('click',async()=>{const status=$('.copy-status');try{await navigator.clipboard.writeText('arnavmangarapu96@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='Copy: arnavmangarapu96@gmail.com';}});
  $('#year').textContent=String(new Date().getFullYear());
})();
