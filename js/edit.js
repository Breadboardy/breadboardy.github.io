/* ============================================================
   edit.js — the writing panel.

   Only ever wakes up on localhost with edit.py running. On GitHub Pages
   this file loads, finds no server, and does nothing at all — visitors
   never see a button.

   Edits go to POST /api/save, which writes them into js/data.js. It edits
   the exact field you changed and leaves every comment in place.
   ============================================================ */

(function () {
  const LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!LOCAL) return;

  /* every field the panel knows how to edit, in the order it shows them */
  const SCHEMA = [
    { id: 'home', title: 'Home page', fields: [
      { target: 'SITE', field: 'role',  label: 'One line under your name', hint: 'e.g. I build robots, games and tools' },
      { target: 'SITE', field: 'intro', label: 'Intro paragraph', big: true, hint: '3–4 sentences' },
      { target: 'SITE', field: 'now',   label: 'What you’re on this week', hint: 'keep this current' },
    ]},
    { id: 'profile', title: 'Profile', fields: [
      { target: 'PROFILE', field: 'headline', label: 'Headline' },
      { target: 'PROFILE', field: 'location', label: 'Location' },
      { target: 'PROFILE', field: 'openTo',   label: 'What you want from a school' },
      { target: 'SITE',    field: 'about',    label: 'More about me', big: true, tall: true,
        hint: 'the big one — several paragraphs, blank line between each. aim 250–500 words.' },
    ]},
    { id: 'links', title: 'Links', fields: [
      { target: 'SITE', field: 'github',   label: 'GitHub' },
      { target: 'SITE', field: 'linkedin', label: 'LinkedIn' },
      { target: 'SITE', field: 'youtube',  label: 'YouTube' },
      { target: 'SITE', field: 'email',    label: 'Email' },
    ]},
  ];

  const STEPS = [
    ['tagline',   'One line: what is it?'],
    ['goal',      '1. What I was trying to do'],
    ['firstTry',  '2. What I tried first'],
    ['wentWrong', '3. What went wrong'],
    ['changed',   '4. What I changed'],
    ['nowDoes',   '5. What it does now'],
    ['next',      '6. What I would do next'],
    ['repo',      'Code link'],
    ['demo',      'Demo video link'],
  ];

  const dirty = new Map();            // "TARGET|key|field" -> {spec, value}
  let panel, statusEl;

  const esc = s => String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const readValue = spec => {
    const src = { SITE, PROFILE, PROJECTS, LOG, TALKS, AWARDS, EDUCATION, LANGUAGES }[spec.target];
    if (!Array.isArray(src)) return src[spec.field] || '';
    const item = spec.key != null ? src.find(x => x.id === spec.key) : src[spec.index || 0];
    return (item && item[spec.field]) || '';
  };

  /* ---------- one field ---------- */

  function fieldRow(spec, label, hint, big, tall) {
    const key = `${spec.target}|${spec.key ?? spec.index ?? ''}|${spec.field}`;
    const val = readValue(spec);
    const wrap = document.createElement('label');
    wrap.className = 'ed-field';
    wrap.innerHTML = `
      <span class="ed-label">${esc(label)}${val ? '' : ' <em>empty</em>'}</span>
      ${hint ? `<span class="ed-hint">${esc(hint)}</span>` : ''}
      <textarea rows="${tall ? 12 : big ? 4 : 1}" spellcheck="true"></textarea>
      <span class="ed-count"></span>`;

    const ta = wrap.querySelector('textarea');
    const count = wrap.querySelector('.ed-count');
    ta.value = val;

    /* grow to fit, but stop at ~45% of the window and scroll inside after that,
       otherwise a long answer makes one box taller than the whole panel */
    const grow = () => {
      const max = Math.max(160, Math.round(innerHeight * 0.45));
      ta.style.height = 'auto';
      const full = ta.scrollHeight;
      ta.style.height = Math.min(full, max) + 'px';
      ta.style.overflowY = full > max ? 'auto' : 'hidden';
    };

    /* keep the caret in view when it reaches the bottom of a capped box */
    const followCaret = () => {
      const panel = wrap.closest('.ed-body');
      if (!panel) return;
      const r = ta.getBoundingClientRect(), p = panel.getBoundingClientRect();
      if (r.bottom > p.bottom) panel.scrollTop += r.bottom - p.bottom + 12;
      else if (r.top < p.top)  panel.scrollTop -= p.top - r.top + 12;
    };
    const tally = () => {
      const w = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
      count.textContent = w ? `${w} word${w === 1 ? '' : 's'}` : '';
    };

    ta.addEventListener('input', () => {
      grow(); tally(); followCaret();
      dirty.set(key, { spec, value: ta.value });
      wrap.classList.add('ed-dirty');
      mark();
    });
    ta.addEventListener('focus', () => requestAnimationFrame(followCaret));
    addEventListener('resize', grow);
    requestAnimationFrame(grow); tally();
    return wrap;
  }

  /* ---------- sections ---------- */

  function group(title, note) {
    const d = document.createElement('section');
    d.className = 'ed-group';
    d.innerHTML = `<h3>${esc(title)}${note ? ` <span>${esc(note)}</span>` : ''}</h3>`;
    return d;
  }

  function build() {
    const body = panel.querySelector('.ed-body');
    body.innerHTML = '';

    SCHEMA.forEach(sec => {
      const g = group(sec.title);
      sec.fields.forEach(f => g.appendChild(
        fieldRow({ target: f.target, field: f.field }, f.label, f.hint, f.big, f.tall)));
      body.appendChild(g);
    });

    /* projects */
    PROJECTS.forEach(p => {
      const done = STEPS.slice(1, 7).filter(([k]) => p[k]).length;
      const g = group(p.name, `${done}/6 written`);
      g.classList.add('ed-collapsed');
      g.querySelector('h3').onclick = () => g.classList.toggle('ed-collapsed');
      [['name', 'Name'], ...STEPS].forEach(([field, label]) =>
        g.appendChild(fieldRow({ target: 'PROJECTS', key: p.id, field }, label, '',
                               ['goal','firstTry','wentWrong','changed','nowDoes','next'].includes(field))));
      body.appendChild(g);
    });

    /* growing lists */
    [['LOG', 'Build log', LOG, [['date','Date'],['title','Title'],['body','Entry']], 'log'],
     ['AWARDS', 'Awards', AWARDS, [['title','Title'],['org','Who ran it'],['date','Date'],['url','Link'],['detail','What happened']], 'award'],
     ['TALKS', 'Talks', TALKS, [['title','Title'],['project','Project id'],['date','Date'],['url','Video link'],['blurb','Blurb']], 'talk'],
     ['EDUCATION', 'Education', EDUCATION, [['what','What'],['where','Where'],['from','From'],['to','To'],['detail','Detail']], null],
     ['LANGUAGES', 'Languages', LANGUAGES, [['name','Language'],['level','Level']], null],
    ].forEach(([target, title, arr, fields, addKind]) => {
      const g = group(title, `${arr.length}`);
      g.classList.add('ed-collapsed');
      g.querySelector('h3').onclick = () => g.classList.toggle('ed-collapsed');
      arr.forEach((item, index) => {
        if (arr.length > 1) {
          const h = document.createElement('div');
          h.className = 'ed-sub';
          h.textContent = item.title || item.name || item.what || item.date || `#${index + 1}`;
          g.appendChild(h);
        }
        fields.forEach(([field, label]) => g.appendChild(
          fieldRow({ target, index, field }, label, '',
                   ['body','detail','blurb'].includes(field))));
      });
      if (addKind) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ed-add';
        b.textContent = `+ new ${addKind}`;
        b.onclick = () => add(addKind);
        g.appendChild(b);
      }
      body.appendChild(g);
    });
  }

  /* ---------- talking to edit.py ---------- */

  function mark() {
    const n = dirty.size;
    panel.querySelector('.ed-save').disabled = !n;
    statusEl.textContent = n ? `${n} unsaved change${n === 1 ? '' : 's'}` : 'saved';
    statusEl.className = 'ed-status' + (n ? ' ed-warn' : '');
  }

  async function post(url, payload) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const out = await r.json().catch(() => ({ ok: false, error: 'bad response' }));
    if (!r.ok || !out.ok) throw new Error(out.error || `HTTP ${r.status}`);
    return out;
  }

  async function save() {
    if (!dirty.size) return;
    statusEl.textContent = 'saving…'; statusEl.className = 'ed-status';
    try {
      await post('/api/save', { edits: [...dirty.values()].map(d => ({ ...d.spec, value: d.value })) });
      dirty.clear();
      statusEl.textContent = 'saved — reloading';
      setTimeout(() => location.reload(), 400);
    } catch (e) {
      statusEl.textContent = 'failed: ' + e.message;
      statusEl.className = 'ed-status ed-bad';
    }
  }

  async function add(kind) {
    try {
      if (dirty.size) await save();
      await post('/api/add', { kind });
      location.reload();
    } catch (e) {
      statusEl.textContent = 'failed: ' + e.message;
      statusEl.className = 'ed-status ed-bad';
    }
  }

  /* ---------- chrome ---------- */

  function open()  { panel.classList.add('ed-open');  document.body.classList.add('ed-shifted'); }
  function close() { panel.classList.remove('ed-open'); document.body.classList.remove('ed-shifted'); }

  function mount() {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'css/edit.css';
    document.head.appendChild(css);

    const btn = document.createElement('button');
    btn.className = 'ed-open-btn'; btn.type = 'button';
    btn.textContent = '✎ Edit';
    btn.onclick = open;
    document.body.appendChild(btn);

    panel = document.createElement('aside');
    panel.className = 'ed-panel';
    panel.innerHTML = `
      <header class="ed-head">
        <strong>Edit</strong>
        <span class="ed-status">saved</span>
        <button class="ed-save" type="button" disabled>Save</button>
        <button class="ed-close" type="button" aria-label="Close">×</button>
      </header>
      <div class="ed-body"></div>
      <footer class="ed-foot">writes to js/data.js · previous version kept as data.js.bak</footer>`;
    document.body.appendChild(panel);

    statusEl = panel.querySelector('.ed-status');
    panel.querySelector('.ed-save').onclick = save;
    panel.querySelector('.ed-close').onclick = close;

    addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); }
      if (e.key === 'Escape' && panel.classList.contains('ed-open')) close();
    });
    addEventListener('beforeunload', e => { if (dirty.size) { e.preventDefault(); e.returnValue = ''; } });

    build();
  }

  /* only mount if edit.py is actually answering */
  fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ edits: [] }),
  }).then(r => { if (r.ok) mount(); }).catch(() => {});
})();
