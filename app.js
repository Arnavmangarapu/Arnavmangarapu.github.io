(() => {
  'use strict';
  const data = window.portfolio;
  const $ = selector => document.querySelector(selector);
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => {
    if (!value) return null;
    try { const u = new URL(value, location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; }
  };
  const visuals = {
    vision: `<svg class="vision-svg" viewBox="0 0 500 430" fill="none" aria-hidden="true"><defs><linearGradient id="helmet-metal" x1="120" y1="80" x2="400" y2="330" gradientUnits="userSpaceOnUse"><stop stop-color="#71987b"/><stop offset=".25" stop-color="#c3dbc1"/><stop offset=".45" stop-color="#65826a"/><stop offset=".75" stop-color="#1d3527"/><stop offset="1" stop-color="#41634c"/></linearGradient><linearGradient id="visor" x1="170" y1="200" x2="405" y2="300"><stop stop-color="#0b1b15"/><stop offset=".7" stop-color="#345841"/><stop offset="1" stop-color="#98c3a0"/></linearGradient></defs><ellipse cx="267" cy="365" rx="150" ry="14" fill="#000" opacity=".2"/><circle cx="250" cy="215" r="170" stroke="#9fbea1" stroke-opacity=".25" stroke-dasharray="3 9"/><path d="M112 272C92 164 147 76 243 72C340 66 397 138 407 236L375 287L316 326L187 324L129 294Z" fill="url(#helmet-metal)" stroke="#d0e3ca" stroke-opacity=".5"/><path d="M130 202C182 173 300 175 403 212L386 265C291 245 213 254 153 277Z" fill="url(#visor)" stroke="#b7d9b4" stroke-opacity=".6"/><path d="M144 201C199 188 313 187 397 211" stroke="#e0f5d5" stroke-width="2" opacity=".6"/><path d="M145 285L175 311L310 315L369 283" stroke="#bdd7b9" stroke-opacity=".6"/><path d="M187 98L196 159M207 92L218 156M230 88L238 155" stroke="#1a3324" stroke-width="5"/><rect x="341" y="232" width="43" height="26" rx="4" fill="#1a3023" stroke="#c1dcbb"/><circle cx="363" cy="245" r="7" fill="#8eaa83"/><circle cx="363" cy="245" r="3" fill="#d7f2c9"/><path d="M380 246H434V161H461M140 277H66V310H28" stroke="#aac6a7" stroke-width=".8"/><rect x="427" y="127" width="55" height="24" stroke="#8cb693"/><text x="434" y="143" fill="#b5d6b6" font-size="8" font-family="monospace">VISION</text><rect x="20" y="320" width="80" height="24" stroke="#8cb693"/><text x="27" y="336" fill="#b5d6b6" font-size="8" font-family="monospace">EDGE INFERENCE</text><path d="M334 201V185H350M393 185H410V201M410 267V283H394M350 283H334V267" stroke="#c2e6b8" stroke-width="1.5"/></svg>`,
    monitor: `<div class="monitor-art" aria-hidden="true"><div class="monitor-toolbar"><i></i><i></i><i></i><span>streamwatch / system overview</span></div><div class="monitor-body"><div class="monitor-title">Infrastructure at a glance</div><div class="monitor-stats"><div><span>Database</span><b>MongoDB</b></div><div><span>Metrics</span><b>Live</b></div><div><span>Collector</span><b>Prom.</b></div></div><svg class="monitor-chart" viewBox="0 0 320 110" preserveAspectRatio="none"><line x1="0" y1="20" x2="320" y2="20"/><line x1="0" y1="55" x2="320" y2="55"/><line x1="0" y1="90" x2="320" y2="90"/><path d="M0 85L15 80L25 84L35 65L43 72L52 50L64 59L78 52L89 60L101 30L115 46L128 40L140 48L151 25L164 31L178 16L190 32L205 25L220 42L235 26L250 32L264 17L280 29L295 19L310 24L320 15"/><path d="M0 96L20 93L36 96L50 85L65 89L80 74L95 83L110 71L125 75L145 62L160 67L180 52L195 59L215 46L230 55L250 45L265 52L280 38L300 42L320 31" opacity=".35"/></svg><div class="monitor-bottom"><span>Prometheus → Grafana</span><span>Metrics pipeline</span></div></div></div>`,
    security: `<div class="security-art" aria-hidden="true"><div class="security-orbit"><svg viewBox="0 0 120 140" fill="none"><path d="M60 7L108 28V73C108 100 86 120 60 132C34 120 12 100 12 73V28L60 7Z" stroke="#b3d4c3" stroke-width="1"/><path d="M60 22L95 38V72C95 93 79 109 60 119C41 109 25 93 25 72V38L60 22Z" fill="#aacdba" fill-opacity=".08" stroke="#91b5a4" stroke-opacity=".4"/><path d="M43 68V56C43 32 77 32 77 56V68M39 68H81V98H39Z" stroke="#bedec9" stroke-width="2"/><circle cx="60" cy="80" r="3" fill="#bedec9"/><path d="M60 83V89" stroke="#bedec9" stroke-width="2"/></svg></div><div class="security-terminal"><span class="terminal-line">&gt; input <b>system behaviour logs</b></span><span class="terminal-line">&gt; transform <b>semantic representations</b></span><span class="terminal-line">&gt; model <b>GPT-2 / fine-tuned</b></span><span class="terminal-line">&gt; task <b>ransomware classification_</b></span></div></div>`
  };
  const total = data.projects.length;
  $('#project-list').innerHTML = data.projects.map((p, index) => {
    const repo = safeURL(p.repository);
    const image = safeURL(p.image);
    const next = data.projects[index + 1];
    return `<div class="project-anchor" id="${escapeHTML(p.id)}"></div><article class="project" style="--project-bg:${['#172b22','#1b302e','#1d292a'][index % 3]}" id="${escapeHTML(p.id)}-card" aria-labelledby="${escapeHTML(p.id)}-title"><div class="project-content"><div class="project-meta"><span class="project-count">${String(index + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span><span>${escapeHTML(p.year)} / ${escapeHTML(p.category)}</span></div><h3 id="${escapeHTML(p.id)}-title">${escapeHTML(p.title)}</h3><p class="project-headline">${escapeHTML(p.headline)}</p><p class="project-description">${escapeHTML(p.description)}</p><div class="project-tags">${p.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div><div class="project-actions"><button data-project="${index}">Explore project <span aria-hidden="true">↗</span></button>${repo ? `<a href="${escapeHTML(repo)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}</div><div class="project-foot">Keep scrolling to explore <a href="#${next ? escapeHTML(next.id) : 'experience'}">${next ? 'Next project ↓' : 'Experience ↓'}</a></div></div><div class="project-art"><div class="visual-frame"><div class="visual-grid"></div><span class="illustration-label">${image ? 'Project image' : 'Concept illustration'}</span>${image ? `<img class="custom-project-image" src="${escapeHTML(image)}" alt="${escapeHTML(p.title)} project" loading="lazy">` : visuals[p.visual] || visuals.security}<div class="visual-caption"><span>${escapeHTML(p.category)}</span><span>Explore project ↗</span></div><button class="project-art-open" type="button" data-project="${index}" aria-label="Explore ${escapeHTML(p.title)}"></button></div></div></article>`;
  }).join('');
  $('#skill-list').innerHTML = data.skills.map(([label,tags]) => `<div class="skill-row"><h3>${escapeHTML(label)}</h3><div class="skill-tags">${tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div></div>`).join('');
  const dialog = $('#project-dialog');
  let returnFocus;
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const p = data.projects[Number(button.dataset.project)];
    const repository = safeURL(p.repository), demo = safeURL(p.demo);
    $('#dialog-content').innerHTML = `<h2 id="dialog-title">${escapeHTML(p.title)}</h2><p class="dialog-category">${escapeHTML(p.category)} / ${escapeHTML(p.year)}</p><ul>${p.details.map(d=>`<li>${escapeHTML(d)}</li>`).join('')}</ul><div class="dialog-links">${repository ? `<a href="${escapeHTML(repository)}" target="_blank" rel="noopener">View repository ↗</a>` : '<span class="placeholder-link">[ Repository link — to be added ]</span>'}${demo ? `<a href="${escapeHTML(demo)}" target="_blank" rel="noopener">Live demo ↗</a>` : '<span class="placeholder-link">[ Live demo — to be added ]</span>'}</div>`;
    returnFocus = button;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close', () => {document.body.style.overflow='';returnFocus?.focus({preventScroll:true});});
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
