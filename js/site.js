/* site.js — renders every page from data.js. You shouldn't need to edit this. */

const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

/* "[? ... ]" notes are reminders for Callum in data.js — never show them on the page */
function stripNotes(text) {
  return String(text || '').replace(/\[\?[^\]]*\]/g, '').replace(/[ \t]{2,}/g, ' ').trim();
}

function prose(text, what) {
  const t = stripNotes(text);
  if (!t) return '';                     // blank renders as nothing, not a placeholder
  return t.split(/\n\s*\n/)
    .map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function niceDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
function clip(text, n) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t;
}

/* ---------- theme ---------- */

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch (e) {}
  const b = document.querySelector('.themer');
  if (b) {
    b.textContent = t === 'dark' ? '☀' : '☾';
    b.title = t === 'dark' ? 'Switch to light' : 'Switch to dark';
  }
}
function toggleTheme() {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

/* ---------- shared chrome ---------- */

function renderNav(page) {
  /* a page with nothing on it is worse than no link — hide until it has content */
  const hasLog   = typeof LOG   !== 'undefined' && LOG.some(e => e.body && e.body.trim());
  const hasTalks = typeof TALKS !== 'undefined' && TALKS.some(t => t.url && t.url.trim());
  const links = [
    ['index.html', 'Projects'],
    ...(hasLog   ? [['log.html',   'Build log']] : []),
    ...(hasTalks ? [['talks.html', 'Talks']]     : []),
    ['about.html', 'About'],
  ];
  document.getElementById('nav').innerHTML = `
    <div class="bar">
      <a class="brand" href="index.html"><span class="dot"></span>${esc((SITE.name || 'callum').toLowerCase())}</a>
      <div class="links">
        ${links.map(([h, t]) => `<a href="${h}" class="${h === page ? 'on' : ''}">${t}</a>`).join('')}
        <button class="themer" onclick="toggleTheme()" aria-label="Toggle dark mode"></button>
      </div>
    </div>`;
  setTheme(document.documentElement.getAttribute('data-theme') || 'light');
}

function renderFoot() {
  const el = document.getElementById('foot');
  if (!el) return;
  const link = (href, txt) => href ? `<a href="${esc(href)}">${txt}</a>` : '';
  const built = PROJECTS.filter(p => p.status === 'built').length;
  el.className = 'foot';
  el.innerHTML = `
    <div class="wrap">
      <div class="col">
        <h4>Pages</h4>
        <a href="index.html">Projects</a>
        <a href="log.html">Build log</a>
        <a href="talks.html">Talks &amp; demos</a>
        <a href="about.html">About</a>
      </div>
      <div class="col">
        <h4>Elsewhere</h4>
        ${link(SITE.github, 'GitHub') || '<span>GitHub — soon</span>'}
        ${link(SITE.linkedin, 'LinkedIn') || ''}
        ${link(SITE.youtube, 'Video') || '<span>Video — soon</span>'}
        ${SITE.email ? `<a href="mailto:${esc(SITE.email)}">Email</a>` : '<span>Email — soon</span>'}
      </div>
      <div class="sig">
        ${built} project${built === 1 ? '' : 's'} built · ${LOG.filter(e => e.body).length} log entries<br>
        Hand-written HTML. No frameworks.
      </div>
    </div>`;
}

/* ---------- home ---------- */

function renderHome() {

  /* intro — name, one line, then the intro. no photo yet, by request.
     the words come from SITE.role and SITE.intro in data.js */
  const won = (typeof AWARDS !== 'undefined' ? AWARDS : []).filter(a => a.title);
  const laurel = won.map(a => {
    const yr = (a.date || '').slice(0, 4);
    return `<a class="laurel" href="about.html">
      <span class="k">Award</span>
      <span class="t">${esc(a.title)}</span>
      ${yr ? `<span class="y">${esc(yr)}</span>` : ''}
    </a>`;
  }).join('');

  const hero = document.getElementById('hero');
  if (hero) hero.innerHTML = `
    <div class="who">
      ${laurel}
      <h1>Hi, I’m ${esc(SITE.name || 'Callum')}.</h1>
      <p class="role">${SITE.role ? esc(SITE.role)
        : ''}</p>
      <div class="intro">${prose(SITE.intro, '3-4 sentences in your own words. who you are, what you build, what you are working on right now. (SITE.intro in data.js, or the Edit button)')}</div>
      ${SITE.now ? `<p class="now"><b>Right now:</b> ${esc(SITE.now)}</p>` : ''}
    </div>`;

  /* awards — judged by someone else, so they lead, above my own work */
  const awEl = document.getElementById('awards');
  if (awEl) awEl.innerHTML = '';

  /* featured — the lead, up top */
  const feat = PROJECTS.filter(p => p.category && p.featured);
  const featEl = document.getElementById('featured');
  if (featEl) featEl.innerHTML = feat.length
    ? `<div class="feat-row">${feat.map((p, i) => featuredCard(p, i === 0)).join('')}</div>` : '';

  /* three categories — every project appears here, featured or not */
  const host = document.getElementById('categories');
  host.innerHTML = CATEGORIES.map(cat => {
    const items = PROJECTS.filter(p => p.category === cat.id);
    if (!items.length) return '';
    return `
      <div class="sec-head">
        <h2>${esc(cat.name)}</h2>
        <span class="count">${items.length} project${items.length === 1 ? '' : 's'}</span>
      </div>
      ${cat.blurb ? `<p class="cat-blurb">${esc(cat.blurb)}</p>` : ''}
      <div class="grid">${items.map(card).join('')}</div>`;
  }).join('');

}

function card(p) {
  const sub = p.tagline || (p.tags || []).slice(0, 3).join(' · ');
  return `
    <a class="card" href="project.html?id=${encodeURIComponent(p.id)}">
      ${art(p)}
      <div class="card-text">
        <b>${esc(p.name)}</b>
        <s>${esc(sub)}</s>
        <em class="${p.status === 'built' ? 'built' : ''}">${esc(p.status)}</em>
      </div>
    </a>`;
}

/* the big lead card(s) — best work, up top, to pull a visitor in */
function featuredCard(p, perch) {
  const sub = p.tagline || (p.tags || []).slice(0, 3).join(' · ');
  return `
    <a class="feat${perch ? ' has-perch' : ''}" href="project.html?id=${encodeURIComponent(p.id)}">
      ${perch ? `<img class="perch" src="img/breadboard-guy.png" alt="" aria-hidden="true">` : ''}
      ${art(p, 'feat-art')}
      <div class="feat-text">
        <b>${esc(p.name)}</b>
        <s>${esc(sub)}</s>
        <span class="go">See the build &rarr;</span>
      </div>
    </a>`;
}

/* ---------- cover art ----------
   No two projects get the same colour, but every colour stays inside the
   site's green-to-blue band so the grid doesn't turn into a rainbow.
   Same id always gives the same hue, so cards don't shuffle on reload. */

function hueOf(id) {
  let h = 0;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return 96 + (h % 124);            // 96deg .. 220deg
}

function photoOf(p) {
  if (Array.isArray(p.photos) && p.photos.length) return p.photos[0][0];
  return p.image || '';
}
function art(p, cls = 'art') {
  const src = photoOf(p);
  return src
    ? `<div class="${cls} has-img" style="background-image:url('${esc(src)}')"></div>`
    : `<div class="${cls}" style="--h:${hueOf(p.id)}"></div>`;
}

/* ---------- project detail ---------- */

const STEPS = [
  ['goal',      'What I was trying to do',  false],
  ['firstTry',  'What I tried first',       false],
  ['wentWrong', 'What went wrong',          true ],
  ['changed',   'What I changed',           false],
  ['nowDoes',   'What it does now',         false],
  ['next',      'What I would do next',     false],
];

function renderProject() {
  const id = new URLSearchParams(location.search).get('id');
  const i  = PROJECTS.findIndex(x => x.id === id);
  const el = document.getElementById('project');

  if (i < 0) {
    document.title = 'Not found';
    el.innerHTML = `<a class="back" href="index.html">← all projects</a>
      <div class="p-head"><h1>Project not found</h1>
      <p class="tagline">That link doesn’t match anything on the site.</p></div>`;
    return;
  }

  const p = PROJECTS[i];
  const prev = PROJECTS[i - 1], next = PROJECTS[i + 1];
  document.title = `${p.name} — ${SITE.name || 'Callum'}`;

  const btns = [];
  if (p.repo) btns.push(`<a class="btn" href="${esc(p.repo)}">Code →</a>`);
  if (p.demo) btns.push(`<a class="btn" href="${esc(p.demo)}">Demo video →</a>`);

  el.innerHTML = `
    <a class="back" href="index.html">← all projects</a>
    <div class="p-head">
      <h1>${esc(p.name)}</h1>
      <p class="tagline">${p.tagline ? esc(p.tagline)
        : ''}</p>
      <div class="p-meta">
        <span class="status ${p.status === 'built' ? 'built' : ''}">${esc(p.status)}</span>
        <span class="btn">started ${esc(p.started)}</span>
        ${btns.join('')}
      </div>
    </div>
    ${p.image && !(Array.isArray(p.photos) && p.photos.length) ?
        `<img class="p-hero" src="${esc(p.image)}" alt="${esc(p.name)}">` : ''}
    ${Array.isArray(p.photos) && p.photos.length ? `
      <div class="shots">
        ${p.photos.map(([src, cap]) => `
          <figure>
            <img src="${esc(src)}" alt="${esc(cap || p.name)}" loading="lazy">
            ${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}
          </figure>`).join('')}
      </div>` : ''}
    ${STEPS
        .map(([key, heading, isKey]) => ({ body: prose(p[key], ''), heading, isKey }))
        .filter(st => st.body)                       /* nothing written -> no section at all */
        .map((st, n) => `
      <section class="step ${st.isKey ? 'key' : ''}">
        <div class="num">${String(n + 1).padStart(2, '0')}</div>
        <h2>${st.heading}</h2>
        ${st.body}
      </section>`).join('')}
    <nav class="p-nav">
      <span>${prev ? `<a href="project.html?id=${encodeURIComponent(prev.id)}">← ${esc(prev.name)}</a>` : ''}</span>
      <span>${next ? `<a href="project.html?id=${encodeURIComponent(next.id)}">${esc(next.name)} →</a>` : ''}</span>
    </nav>`;
}

/* ---------- build log ---------- */

function renderLog() {
  const real = LOG.filter(e => e.title || e.body);
  const words = LOG.reduce((n, e) => n + (e.body ? e.body.trim().split(/\s+/).length : 0), 0);
  document.getElementById('count').textContent =
    `${real.length} ${real.length === 1 ? 'entry' : 'entries'} · ${words.toLocaleString()} words`;

  document.getElementById('entries').innerHTML = LOG.map(e => `
    <article class="entry">
      <div class="date">${esc(niceDate(e.date))}</div>
      <h2>${e.title ? esc(e.title)
        : ''}</h2>
      ${e.body ? `<div class="mins">${Math.max(1, Math.round(e.body.trim().split(/\s+/).length / 200))} min read</div>` : ''}
      ${prose(e.body, 'what did you work on? what broke? what did you figure out? 100-150 words.')}
    </article>`).join('');
}

/* ---------- talks ---------- */

function renderTalks() {
  const real = TALKS.filter(t => t.url || t.title);
  document.getElementById('count').textContent =
    `${real.length} ${real.length === 1 ? 'video' : 'videos'}`;

  document.getElementById('talks').innerHTML = TALKS.map(t => {
    const proj = PROJECTS.find(p => p.id === t.project);
    return `
    <article class="talk">
      <div class="thumb" style="--h:${hueOf(t.project || t.title || 'x')}">${t.thumb
        ? `<img src="${esc(t.thumb)}" alt="${esc(t.title)}">`
        : '<span>no thumbnail yet</span>'}</div>
      <div class="body">
        <h3>${t.title ? esc(t.title) : ''}</h3>
        <div class="when">${[niceDate(t.date), proj && proj.name].filter(Boolean).join(' · ') || '—'}</div>
        ${t.blurb ? `<p>${esc(t.blurb)}</p>`
          : ''}
        ${t.url ? `<div><a href="${esc(t.url)}">Watch →</a></div>` : ''}
      </div>
    </article>`; }).join('');
}

/* ---------- about ---------- */

function renderAbout() {
  const el = document.getElementById('about');
  const section = (title, body, note, cls) => `
    <section class="pcard${cls ? ' ' + cls : ''}">
      <div class="pcard-head"><h2>${title}</h2>${note ? `<span class="note">${note}</span>` : ''}</div>
      ${body}
    </section>`;

  /* --- identity block --- */
  const id = `
    <header class="pid">
      <div class="cover" aria-hidden="true"></div>
      <div class="pid-body">
        ${SITE.photo ? `<img class="avatar" src="${esc(SITE.photo)}" alt="${esc(SITE.name)}">` : ''}
        <div class="pid-text">
          <h1>${esc(SITE.name || 'Callum')}</h1>
          <p class="headline">${PROFILE.headline ? esc(PROFILE.headline)
            : ''}</p>
          <p class="meta">
            ${PROFILE.location ? esc(PROFILE.location) + ' · ' : ''}
            ${PROJECTS.filter(p => p.status === 'built').length} projects built
          </p>
          <div class="quick">
            ${SITE.github   ? `<a href="${esc(SITE.github)}">GitHub →</a>`     : ''}
            ${SITE.linkedin ? `<a href="${esc(SITE.linkedin)}">LinkedIn →</a>` : ''}
            ${SITE.youtube  ? `<a href="${esc(SITE.youtube)}">Videos →</a>`    : ''}
            ${SITE.email    ? `<a href="mailto:${esc(SITE.email)}">Email →</a>` : ''}
            <a href="index.html">Projects →</a>
          </div>
        </div>
      </div>
    </header>`;

  /* --- open to --- */
  const openTo = PROFILE.openTo
    ? `<div class="banner"><span class="k">Looking for</span><p>${esc(PROFILE.openTo)}</p></div>` : '';

  /* --- the long-form intro. this is the bit people actually read. --- */
  const yap = `
    <section class="yap">
      <h2>More about me.</h2>
      ${SITE.about && SITE.about.trim()
        ? prose(SITE.about, '')
        : ''}
    </section>`;

  /* --- education --- */
  const eduRows = EDUCATION.filter(e => e.what || e.where || e.detail);
  const edu = eduRows.length === 0 ? '' : section('Education', eduRows.map(e => `
    <div class="row">
      <div class="row-main">
        <h3>${e.what ? esc(e.what) : ''}</h3>
        ${e.where ? `<div class="org">${esc(e.where)}</div>` : ''}
        ${e.detail ? `<p>${esc(e.detail)}</p>` : ''}
      </div>
      <div class="row-when">${[e.from, e.to].filter(Boolean).join(' – ') || '—'}</div>
    </div>`).join(''));

  /* --- skills, counted off the projects automatically --- */
  const counts = {};
  PROJECTS.filter(p => p.category).forEach(p => (p.tags || []).forEach(t => counts[t] = (counts[t] || 0) + 1));
  EXTRA_SKILLS.forEach(t => counts[t] = counts[t] || 0);
  const skills = section('Skills',
    `<div class="belt">${Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t, n]) => `<span class="t"><b>${esc(t)}</b>${n ? ` <i>${n}</i>` : ''}</span>`)
      .join('')}</div>`,
    'counted off my projects');

  /* --- projects, compact --- */
  const projects = section('Projects', PROJECTS.map(p => `
    <a class="row link" href="project.html?id=${encodeURIComponent(p.id)}">
      <div class="row-main">
        <h3>${esc(p.name)}</h3>
        <div class="org">${p.tagline ? esc(p.tagline) : (p.tags || []).join(' · ')}</div>
      </div>
      <div class="row-when"><span class="status ${p.status === 'built' ? 'built' : ''}">${esc(p.status)}</span></div>
    </a>`).join(''), `${PROJECTS.length} total`);

  /* --- awards --- */
  const awRows = AWARDS.filter(a => a.title || a.detail);
  const awards = awRows.length === 0 ? '' : section('Awards &amp; competitions', awRows.map(a => `
    <div class="row">
      <div class="row-main">
        <h3>${a.title ? esc(a.title) : ''}</h3>
        ${a.org ? `<div class="org">${esc(a.org)}</div>` : ''}
        ${prose(a.detail, '')}
        ${a.url ? `<a href="${esc(a.url)}">Results →</a>` : ''}
      </div>
      <div class="row-when">${niceDate(a.date) || '—'}</div>
    </div>`).join(''), 'externally judged', 'award-card');

  /* --- languages --- */
  const langs = section('Languages', `<div class="belt">${LANGUAGES.map(l => `
    <span class="t"><b>${esc(l.name)}</b> ${l.level
      ? `<i>${esc(l.level)}</i>`
      : '<i style="color:var(--warn)">level?</i>'}</span>`).join('')}</div>`);

  el.innerHTML = id + awards + yap + openTo + edu + skills + projects + langs;
}


/* ---------- ambient wash behind everything ---------- */

function ambient() {
  if (document.querySelector('.ambient')) return;
  const a = document.createElement('div');
  a.className = 'ambient';
  a.setAttribute('aria-hidden', 'true');
  a.innerHTML = '<i></i><i></i><i></i>';
  document.body.prepend(a);
}

/* ---------- staggered entrance ----------
   Everything gets .rise, then .in is added as it scrolls into view,
   offset a little per item so a row arrives as a wave, not a block. */

function reveal(selector = '.card, .featured, .talk, .peek, .stats, .step, .entry, .belt, .hero > *, .page-head') {
  const items = [...document.querySelectorAll(selector)];
  if (!items.length) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  items.forEach(el => el.classList.add('rise'));

  const show = (el, i) => setTimeout(() => el.classList.add('in'), Math.min(i, 6) * 65);

  if (!('IntersectionObserver' in window)) {   // old browser: just show everything
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((rows, obs) => {
    rows.filter(r => r.isIntersecting).forEach((r, i) => {
      show(r.target, i);
      obs.unobserve(r.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });

  items.forEach(el => io.observe(el));

  /* anything already on screen at load shouldn't wait for a scroll event */
  requestAnimationFrame(() => items.forEach((el, i) => {
    if (el.getBoundingClientRect().top < innerHeight) { show(el, i); io.unobserve(el); }
  }));

  /* failsafe: the entrance is decoration, the words are the point. if the
     observer hasn't fired for something after 1.5s, show it anyway. */
  setTimeout(() => { io.disconnect(); items.forEach(el => el.classList.add('in')); }, 1500);
}


/* ---------- back to top ----------
   The pages got long. Appears once you're past a screen and a half. */

function backToTop() {
  const b = document.createElement('button');
  b.className = 'totop';
  b.type = 'button';
  b.setAttribute('aria-label', 'Back to top');
  b.textContent = '\u2191';
  b.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(b);

  let ticking = false;
  const update = () => {
    b.classList.toggle('show', scrollY > innerHeight * 1.5);
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ---------- images fade in rather than snapping ---------- */

function fadeImages() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth) { img.classList.add('ready'); return; }
    img.addEventListener('load',  () => img.classList.add('ready'), { once: true });
    img.addEventListener('error', () => img.classList.add('ready'), { once: true });
  });
}

function polish() { backToTop(); fadeImages(); }
