/* ==========================================================================
   APPLICATION CONTROLLER
   --------------------------------------------------------------------------
   Vanilla JS, no framework, no build-time dependency. Two modules rendered
   into #app, switched by the masthead tabs.

   State lives in one object. Every render function is pure-ish: it reads
   STATE and rewrites a container's innerHTML. That is fine at this scale
   (12 careers, ~72 questions) and keeps the whole thing explainable, which
   the case explicitly requires.
   ========================================================================== */

const STATE = {
  tab: 'explore',                // 'explore' | 'interview'
  selectedCareer: null,          // career id shown in the detail panel
  finder: { open: false, step: 0, scores: {}, done: false },
  interview: {
    careerId: 'software-developer',
    index: 0,
    answers: {},                 // key: careerId:index -> text
    results: {},                 // key: careerId:index -> feedback object
    revealed: {}                 // key: careerId:index -> bool
  }
};

const $ = function (sel) { return document.querySelector(sel); };
const byId = function (id) { return document.getElementById(id); };

function careerById(id) {
  for (let i = 0; i < CAREERS.length; i++) {
    if (CAREERS[i].id === id) return CAREERS[i];
  }
  return null;
}

function money(n) {
  return '$' + n.toLocaleString('en-US');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ==========================================================================
   MODULE 1 - CAREER PATH DISCOVERY
   ========================================================================== */

function renderExplore() {
  const latest = DEPARTMENT_STATS.years[DEPARTMENT_STATS.years.length - 1];

  return (
    '<section class="hero">' +
      '<div class="wrap">' +
        '<p class="eyebrow" style="color:var(--royal-100)">Module 1</p>' +
        '<h2>Twelve ways an IS degree actually turns into a job.</h2>' +
        '<p>Most students pick a path in their last semester. This maps the ' +
        'range first - what each role does daily, what an intern is expected ' +
        'to know, what it pays, and what makes a strong candidate.</p>' +
      '</div>' +
    '</section>' +

    '<div class="wrap">' +
      '<div class="statstrip">' +
        stat(latest.bsisPlacement + '%', 'BSIS placement rate', 'Class of ' + latest.year) +
        stat(money(latest.bsisSalary), 'BSIS average salary', 'Class of ' + latest.year) +
        stat(latest.mismPlacement + '%', 'MISM placement rate', 'Class of ' + latest.year) +
        stat(money(latest.mismSalary), 'MISM average salary', 'Class of ' + latest.year) +
      '</div>' +
      '<p style="font-size:var(--t-xs);color:var(--n-500);margin-top:calc(var(--s-4) * -1)">' +
        'Source: <a href="' + DEPARTMENT_STATS.sourceUrl + '" target="_blank" rel="noopener">' +
        esc(DEPARTMENT_STATS.sourceLabel) + '</a>' +
      '</p>' +
    '</div>' +

    '<section class="section"><div class="wrap">' +
      '<div class="section__head">' +
        '<div>' +
          '<h3>Twelve paths</h3>' +
          '<p>Select a path to see the day-to-day, the skills, what employers ' +
          'expect from an intern, and where the salary numbers come from.</p>' +
        '</div>' +
        '<button class="btn btn--ghost" id="open-finder">Not sure? Take the 6-question Fit Finder</button>' +
      '</div>' +
      '<div id="finder-slot"></div>' +
      '<div class="pathgrid" id="pathgrid">' + CAREERS.map(pathCard).join('') + '</div>' +
      '<div id="detail-slot"></div>' +
    '</div></section>' +

    '<section class="section"><div class="wrap">' +
      '<div class="section__head"><div>' +
        '<h3>What these roles pay - and why the number you will be offered is lower</h3>' +
        '<p>The bars are national pay for the whole occupation, all experience ' +
        'levels pooled. The line is what BYU IS graduates actually averaged as ' +
        'a starting salary. Read the gap as career runway, not as a broken promise.</p>' +
      '</div></div>' +
      payChart() +
    '</div></section>'
  );
}

function stat(value, label, note) {
  return (
    '<div class="stat">' +
      '<div class="stat__value">' + esc(value) + '</div>' +
      '<div class="stat__label">' + esc(label) + '</div>' +
      '<div class="stat__note">' + esc(note) + '</div>' +
    '</div>'
  );
}

function pathCard(c) {
  const on = STATE.selectedCareer === c.id;
  return (
    '<button class="pathcard" data-career="' + c.id + '" aria-pressed="' + on + '">' +
      '<span class="pathcard__icon">' + icon(c.icon) + '</span>' +
      '<span class="pathcard__text">' +
        '<span class="pathcard__name">' + esc(c.name) + '</span>' +
        '<span class="pathcard__meta">' + esc(c.family) + '</span>' +
      '</span>' +
    '</button>'
  );
}

/* ---------- detail panel ------------------------------------------------- */

function renderDetail(id) {
  const c = careerById(id);
  if (!c) return '';

  const growthClass =
    c.growthPct == null ? 'growth--avg'
      : c.growthPct >= 10 ? 'growth--fast'
      : c.growthPct >= 5 ? 'growth--avg'
      : 'growth--slow';

  const growthText =
    c.growthPct == null
      ? esc(c.growthLabel)
      : c.growthPct + '% growth, ' + esc(c.growthWindow) + ' (' + esc(c.growthLabel) + ')';

  const basisNote =
    c.payBasis === 'bls'
      ? 'BLS median - all experience levels pooled, not a starting salary.'
      : 'Industry salary-guide figures. Wider spread and self-reported - treat as a range, not a fact.';

  return (
    '<div class="detail" id="detail" tabindex="-1">' +
      '<div class="detail__head">' +
        '<span class="pathcard__icon">' + icon(c.icon, 28) + '</span>' +
        '<div>' +
          '<h3>' + esc(c.name) + '</h3>' +
          '<p>' + esc(c.tagline) + '</p>' +
        '</div>' +
        '<button class="detail__close" id="close-detail">Close</button>' +
      '</div>' +

      '<div class="detail__body">' +
        '<div class="detail__main">' +
          field('What the job is, day to day', '<p>' + esc(c.dayToDay) + '</p>') +
          field('Skills and tools', '<div class="chips">' +
            c.skills.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') +
          '</div>') +
          field('What an intern or entry-level candidate is expected to have',
            '<p>' + esc(c.entry) + '</p>') +
          field('What makes a strong candidate',
            '<ul class="traits">' +
              c.traits.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
            '</ul>') +
          '<div class="cta-row">' +
            '<button class="btn btn--primary" data-practice="' + c.id + '">' +
              'Practise ' + esc(c.name) + ' interview questions' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="detail__side">' +
          '<div class="pay">' +
            '<div class="pay__figure">' + money(c.payMid) + '</div>' +
            '<div class="pay__caption">' + esc(c.payRange) + '</div>' +
            '<div class="growth ' + growthClass + '">' + growthText + '</div>' +
          '</div>' +
          '<p style="font-size:var(--t-xs);color:var(--n-600)">' + esc(basisNote) + '</p>' +
          (c.payNote ? '<p style="font-size:var(--t-xs);color:var(--n-600)">' + esc(c.payNote) + '</p>' : '') +
          '<div class="sources">' +
            '<strong>Sources</strong>' +
            '<ul>' +
              c.sources.map(function (s) {
                return '<li><a href="' + s.url + '" target="_blank" rel="noopener">' +
                  esc(s.label) + '</a></li>';
              }).join('') +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function field(label, html) {
  return '<div class="field"><div class="field__label">' + esc(label) + '</div>' + html + '</div>';
}

/* ---------- pay chart ---------------------------------------------------- */

function payChart() {
  const sorted = CAREERS.slice().sort(function (a, b) { return b.payMid - a.payMid; });
  const max = sorted[0].payMid;
  const byuStart = DEPARTMENT_STATS.years[DEPARTMENT_STATS.years.length - 1].bsisSalary;

  const rows = sorted.map(function (c) {
    const pct = Math.round((c.payMid / max) * 100);
    return (
      '<div class="chartrow">' +
        '<div class="chartrow__name">' + esc(c.name) +
          (c.payBasis === 'industry'
            ? ' <span style="color:var(--n-400);font-weight:400">(industry est.)</span>' : '') +
        '</div>' +
        '<div class="chartrow__track">' +
          '<div class="chartrow__fill" style="width:' + pct + '%"></div>' +
        '</div>' +
        '<div class="chartrow__val">' + money(c.payMid) + '</div>' +
      '</div>'
    );
  }).join('');

  const startPct = Math.round((byuStart / max) * 100);

  return (
    '<div class="legend">' +
      '<span><i class="swatch" style="background:var(--byu-royal)"></i> ' +
        'National pay for the occupation (all experience levels)</span>' +
      '<span><i class="swatch" style="background:var(--byu-navy)"></i> ' +
        'BYU BSIS average starting salary, class of ' + DEPARTMENT_STATS.latest + '</span>' +
    '</div>' +
    '<div class="chart">' + rows +
      '<div class="chartrow" style="margin-top:var(--s-3);border-top:1px solid var(--n-200);padding-top:var(--s-3)">' +
        '<div class="chartrow__name" style="color:var(--byu-navy)">BYU BSIS starting average</div>' +
        '<div class="chartrow__track">' +
          '<div class="chartrow__fill chartrow__fill--start" style="width:' + startPct + '%"></div>' +
        '</div>' +
        '<div class="chartrow__val">' + money(byuStart) + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="callout">' +
      '<strong>Read the two bars differently.</strong> A BLS median pools ' +
      'twenty-year veterans with first-year hires, so it is a picture of the ' +
      'occupation, not of your first offer. BYU reports an average starting salary ' +
      'of ' + money(byuStart) + ' for the class of ' + DEPARTMENT_STATS.latest + '. ' +
      'The distance between the two is roughly what a career in that role earns you ' +
      'over time - which makes growth rate, not starting pay, the number worth ' +
      'optimising at 21.' +
    '</div>' +
    '<div class="disclaimer">' +
      'Bars marked <em>(industry est.)</em> come from salary guides and aggregators ' +
      '(Robert Half, Glassdoor, PayScale, ZipRecruiter, KORE1) rather than the BLS, ' +
      'because those roles are not published as a single BLS occupation code. They ' +
      'are self-reported or posting-derived and carry a wider margin of error. Every ' +
      'figure links to its source inside the role detail.' +
    '</div>'
  );
}

/* ---------- fit finder --------------------------------------------------- */

function renderFinder() {
  const f = STATE.finder;
  if (!f.open) return '';

  if (f.done) {
    const ranked = scoreFinder();
    return (
      '<div class="finder" id="finder">' +
        '<p class="eyebrow">Your closest matches</p>' +
        '<div class="results">' +
          ranked.slice(0, 3).map(function (r, i) {
            return (
              '<div class="result">' +
                '<div class="result__rank">' + (i + 1) + '</div>' +
                '<div class="result__body">' +
                  '<div class="result__name">' + esc(r.career.name) + '</div>' +
                  '<div class="result__why">' + esc(r.why) + '</div>' +
                '</div>' +
                '<div class="result__meter">' +
                  '<div class="result__fill" style="width:' + r.pct + '%"></div>' +
                '</div>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
        '<div class="cta-row">' +
          '<button class="btn btn--primary" data-career="' + ranked[0].career.id + '">' +
            'Open ' + esc(ranked[0].career.name) + '</button>' +
          '<button class="btn btn--ghost" id="restart-finder">Start over</button>' +
          '<button class="btn btn--ghost" id="close-finder">Close</button>' +
        '</div>' +
        '<div class="callout">' +
          '<strong>This is a starting point, not a verdict.</strong> The Fit Finder ' +
          'matches your answers against eight traits we scored each role on - it ' +
          'has no idea what you are good at, only what you said you enjoy. Treat the ' +
          'top three as the three worth reading about first.' +
        '</div>' +
      '</div>'
    );
  }

  const q = FIT_QUESTIONS[f.step];
  const pct = Math.round((f.step / FIT_QUESTIONS.length) * 100);
  return (
    '<div class="finder" id="finder">' +
      '<div class="finder__progress"><div class="finder__bar" style="width:' + pct + '%"></div></div>' +
      '<p class="eyebrow">Question ' + (f.step + 1) + ' of ' + FIT_QUESTIONS.length + '</p>' +
      '<div class="finder__q">' + esc(q.q) + '</div>' +
      '<div class="opts">' +
        q.options.map(function (o, i) {
          return '<button class="opt" data-opt="' + i + '">' + esc(o.label) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="cta-row"><button class="btn btn--ghost" id="close-finder">Cancel</button></div>' +
    '</div>'
  );
}

/* Deterministic scoring: dot product of the user's accumulated trait weights
   with each career's trait vector, normalised against the highest scorer. */
function scoreFinder() {
  const user = STATE.finder.scores;
  const scored = CAREERS.map(function (c) {
    let total = 0;
    let topDim = null;
    let topVal = -1;
    Object.keys(user).forEach(function (dim) {
      const contribution = user[dim] * (c.traitScores[dim] || 0);
      total += contribution;
      if (contribution > topVal) { topVal = contribution; topDim = dim; }
    });
    return { career: c, raw: total, topDim: topDim };
  });

  scored.sort(function (a, b) { return b.raw - a.raw; });
  const best = scored[0].raw || 1;

  const dimLabel = {
    code: 'you kept choosing hands-on building',
    data: 'you kept choosing working with data',
    people: 'you kept choosing stakeholder-facing work',
    design: 'you kept choosing user-facing design work',
    risk: 'you kept choosing finding what is wrong',
    systems: 'you kept choosing systems and platforms',
    lead: 'you kept choosing coordinating people',
    ambiguity: 'you said you are comfortable without a clear answer'
  };

  return scored.map(function (s) {
    return {
      career: s.career,
      pct: Math.round((s.raw / best) * 100),
      why: 'Matched because ' + (dimLabel[s.topDim] || 'of your overall pattern') + '.'
    };
  });
}

/* ==========================================================================
   MODULE 2 - INTERVIEW PREP
   ========================================================================== */

function renderInterview() {
  const iv = STATE.interview;
  const c = careerById(iv.careerId);
  const bank = QUESTIONS[iv.careerId] || [];
  const q = bank[iv.index];
  const key = iv.careerId + ':' + iv.index;

  return (
    '<section class="hero" style="padding-bottom:var(--s-6)">' +
      '<div class="wrap">' +
        '<p class="eyebrow" style="color:var(--royal-100)">Module 2</p>' +
        '<h2>Practise the questions these roles actually ask.</h2>' +
        '<p>Every question below was reported by a candidate or published in a ' +
        'hiring guide - none were invented. Attempt your answer first, get ' +
        'structured feedback, then compare against a strong version.</p>' +
      '</div>' +
    '</section>' +

    '<section class="section"><div class="wrap"><div class="split">' +
      '<nav class="picker" aria-label="Choose a career path">' +
        '<div class="picker__title">Career path</div>' +
        '<div class="picker__list">' +
          CAREERS.map(function (cc) {
            const has = (QUESTIONS[cc.id] || []).length;
            return (
              '<button class="picker__item" data-iv-career="' + cc.id + '" ' +
                'aria-pressed="' + (cc.id === iv.careerId) + '"' +
                (has ? '' : ' disabled') + '>' +
                icon(cc.icon, 18) + '<span>' + esc(cc.name) + '</span>' +
              '</button>'
            );
          }).join('') +
        '</div>' +
      '</nav>' +

      '<div>' +
        (q ? questionCard(c, bank, q, key) : '<p>No questions loaded for this path.</p>') +
      '</div>' +
    '</div></div></section>'
  );
}

function questionCard(c, bank, q, key) {
  const iv = STATE.interview;
  const saved = iv.answers[key] || '';
  const result = iv.results[key];
  const revealed = iv.revealed[key];

  const dots = bank.map(function (_, i) {
    const k = iv.careerId + ':' + i;
    const cls = iv.results[k] ? 'tracker__dot--done'
      : i === iv.index ? 'tracker__dot--current' : '';
    return '<button class="tracker__dot ' + cls + '" data-goto="' + i + '" ' +
      'title="Question ' + (i + 1) + '">' + (i + 1) + '</button>';
  }).join('');

  return (
    '<div class="qcard">' +
      '<div class="qcard__top">' +
        '<span class="badge badge--' + q.type + '">' + q.type + '</span>' +
        '<span style="font-size:var(--t-sm);color:var(--n-600)">' + esc(c.name) + '</span>' +
        '<span class="qcounter">' + (iv.index + 1) + ' / ' + bank.length + '</span>' +
      '</div>' +

      '<div class="qcard__body">' +
        '<div class="question">' + esc(q.q) + '</div>' +
        '<p class="qsource">Reported source: ' + esc(q.source.label) + '</p>' +

        '<label class="sr-only" for="answer">Your answer</label>' +
        '<textarea class="answer" id="answer" placeholder="Type your answer the way you would say it out loud. Aim for 90-260 words.">' +
          esc(saved) + '</textarea>' +
        '<div class="answer-meta">' +
          '<span id="wordcount">0 words</span>' +
          '<span>' + esc(q.tips) + '</span>' +
        '</div>' +

        '<div class="cta-row">' +
          '<button class="btn btn--primary" id="grade">Get feedback</button>' +
          '<button class="btn btn--ghost" id="reveal">' +
            (revealed ? 'Hide strong answer' : 'Show a strong answer') + '</button>' +
          '<button class="btn btn--ghost" id="next-q">Next question</button>' +
        '</div>' +

        '<div class="tracker">' + dots + '</div>' +
      '</div>' +

      (result ? feedbackPanel(result) : '') +
      (revealed ? modelPanel(q) : '') +
    '</div>'
  );
}

function feedbackPanel(r) {
  return (
    '<div class="feedback" id="feedback" tabindex="-1">' +
      '<div class="score">' +
        '<div class="score__ring" style="--pct:' + r.pct + '%"><span>' + r.pct + '</span></div>' +
        '<div>' +
          '<div class="score__verdict">' + esc(r.verdict) + '</div>' +
          '<div class="score__sub">Structural score across ' + r.dims.length +
            ' dimensions. It measures how the answer is built, not whether the ' +
            'facts in it are true.</div>' +
        '</div>' +
      '</div>' +

      '<div class="fixfirst">' +
        '<strong>Fix this first</strong>' + esc(r.fixFirst) +
      '</div>' +

      '<div class="dims">' +
        r.dims.map(function (d) {
          const mark = d.state === 'ok' ? '&#10003;' : d.state === 'mid' ? '~' : '!';
          return (
            '<div class="dim dim--' + d.state + '">' +
              '<span class="dim__icon">' + mark + '</span>' +
              '<span class="dim__name">' + esc(d.name) + '</span>' +
              '<span class="dim__note">' + esc(d.note) + '</span>' +
            '</div>'
          );
        }).join('') +
      '</div>' +

      '<details class="rubric">' +
        '<summary>How was this scored?</summary>' +
        '<div>' +
          'No AI is involved. Behavioral answers are checked for the four STAR ' +
          'components using cue-phrase matching, the ratio of "I" to "we", how ' +
          'many concrete quantities appear, spoken length, and hedging phrases. ' +
          'Technical answers are checked against a per-question answer key - a ' +
          'list of the points interviewers listen for, written from the sourced ' +
          'material - plus structure and length. Each dimension scores 1, 0.55 or ' +
          '0, and the percentage is the mean. The engine cannot tell whether what ' +
          'you wrote is factually correct, which is exactly why the strong answer ' +
          'is provided for you to compare against.' +
        '</div>' +
      '</details>' +
    '</div>'
  );
}

function modelPanel(q) {
  return (
    '<div class="feedback">' +
      '<div class="model">' +
        '<h4>A strong version of this answer</h4>' +
        '<div class="model__structure">' +
          q.model.structure.map(function (s) {
            return '<span class="model__step">' + esc(s) + '</span>';
          }).join('') +
        '</div>' +
        '<p>' + esc(q.model.text) + '</p>' +
        '<p style="color:var(--n-500);font-size:var(--t-xs);margin-bottom:0">' +
          'Written as a model of structure and specificity. Do not memorise it - ' +
          'the details are invented. Replace them with things that actually ' +
          'happened to you, keeping the shape.' +
        '</p>' +
      '</div>' +
    '</div>'
  );
}

/* ==========================================================================
   RENDER + EVENTS
   ========================================================================== */

function render() {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.setAttribute('aria-selected', String(t.dataset.tab === STATE.tab));
  });

  const app = byId('app');
  app.innerHTML = STATE.tab === 'explore' ? renderExplore() : renderInterview();

  if (STATE.tab === 'explore') {
    byId('finder-slot').innerHTML = renderFinder();
    byId('detail-slot').innerHTML = STATE.selectedCareer
      ? renderDetail(STATE.selectedCareer) : '';
  } else {
    updateWordCount();
  }
}

function updateWordCount() {
  const ta = byId('answer');
  const wc = byId('wordcount');
  if (!ta || !wc) return;
  const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
  wc.textContent = n + ' word' + (n === 1 ? '' : 's');
}

function saveAnswer() {
  const ta = byId('answer');
  if (!ta) return;
  STATE.interview.answers[STATE.interview.careerId + ':' + STATE.interview.index] = ta.value;
}

document.addEventListener('input', function (e) {
  if (e.target.id === 'answer') {
    saveAnswer();
    updateWordCount();
  }
});

document.addEventListener('click', function (e) {
  const t = e.target.closest('button');
  if (!t) return;

  /* --- tabs ------------------------------------------------------------- */
  if (t.classList.contains('tab')) {
    STATE.tab = t.dataset.tab;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  /* --- module 1 --------------------------------------------------------- */
  if (t.id === 'open-finder') {
    STATE.finder = { open: true, step: 0, scores: {}, done: false };
    render();
    const f = byId('finder');
    if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (t.id === 'close-finder') {
    STATE.finder.open = false;
    render();
    return;
  }

  if (t.id === 'restart-finder') {
    STATE.finder = { open: true, step: 0, scores: {}, done: false };
    render();
    return;
  }

  if (t.dataset.opt !== undefined) {
    const q = FIT_QUESTIONS[STATE.finder.step];
    const w = q.options[Number(t.dataset.opt)].w;
    Object.keys(w).forEach(function (dim) {
      STATE.finder.scores[dim] = (STATE.finder.scores[dim] || 0) + w[dim];
    });
    STATE.finder.step += 1;
    if (STATE.finder.step >= FIT_QUESTIONS.length) STATE.finder.done = true;
    render();
    const f = byId('finder');
    if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (t.dataset.career) {
    STATE.selectedCareer = STATE.selectedCareer === t.dataset.career && !t.classList.contains('btn')
      ? null : t.dataset.career;
    render();
    const d = byId('detail');
    if (d) {
      d.scrollIntoView({ behavior: 'smooth', block: 'start' });
      d.focus({ preventScroll: true });
    }
    return;
  }

  if (t.id === 'close-detail') {
    STATE.selectedCareer = null;
    render();
    return;
  }

  if (t.dataset.practice) {
    STATE.tab = 'interview';
    STATE.interview.careerId = t.dataset.practice;
    STATE.interview.index = 0;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  /* --- module 2 --------------------------------------------------------- */
  if (t.dataset.ivCareer) {
    saveAnswer();
    STATE.interview.careerId = t.dataset.ivCareer;
    STATE.interview.index = 0;
    render();
    return;
  }

  if (t.dataset.goto !== undefined) {
    saveAnswer();
    STATE.interview.index = Number(t.dataset.goto);
    render();
    return;
  }

  if (t.id === 'grade') {
    saveAnswer();
    const iv = STATE.interview;
    const key = iv.careerId + ':' + iv.index;
    const q = QUESTIONS[iv.careerId][iv.index];
    iv.results[key] = evaluateAnswer(iv.answers[key] || '', q);
    render();
    const fb = byId('feedback');
    if (fb) {
      fb.scrollIntoView({ behavior: 'smooth', block: 'start' });
      fb.focus({ preventScroll: true });
    }
    return;
  }

  if (t.id === 'reveal') {
    saveAnswer();
    const key = STATE.interview.careerId + ':' + STATE.interview.index;
    STATE.interview.revealed[key] = !STATE.interview.revealed[key];
    render();
    return;
  }

  if (t.id === 'next-q') {
    saveAnswer();
    const bank = QUESTIONS[STATE.interview.careerId];
    STATE.interview.index = (STATE.interview.index + 1) % bank.length;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
});

render();
