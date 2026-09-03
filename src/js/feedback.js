/* ==========================================================================
   FEEDBACK ENGINE
   --------------------------------------------------------------------------
   Deterministic answer analysis. No API key, no network call - which means it
   works offline during the recorded demo and every score can be explained.

   PRINCIPLE: the engine never claims to judge whether an answer is TRUE. It
   measures structural properties that interview coaching consistently
   identifies as separating strong answers from weak ones, and for technical
   questions it checks coverage against a per-question answer key written from
   the sourced material.

   Two analysers:

     BEHAVIORAL  -> STAR completeness, ownership, specificity, length, hedging
     TECHNICAL   -> concept coverage against the question's answer key,
                    plus structure and length

   Each returns:
     { pct, verdict, dims[], fixFirst }
   where dims[] = { name, state: 'ok'|'mid'|'gap', note }  and `note` is
   written to be actionable ("name the metric you moved"), never a grade.
   ========================================================================== */

/* ---------- shared helpers ---------------------------------------------- */

function words(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function hasAny(text, patterns) {
  for (let i = 0; i < patterns.length; i++) {
    if (new RegExp(patterns[i], 'i').test(text)) return true;
  }
  return false;
}

function countMatches(text, pattern) {
  const m = text.match(new RegExp(pattern, 'gi'));
  return m ? m.length : 0;
}

/* Cue lexicons for the STAR analyser. These are deliberately broad - the goal
   is to detect whether the candidate ORIENTED the listener, not to require
   magic words. */
const STAR_CUES = {
  /* Situation: did they set a scene at all - a place, a time, a project? */
  situation: [
    'on (a|an|my|our|the)[^.]{0,34}(project|team|internship|job|class|assignment|engagement|account|program)',
    '\\b(during|while|when)\\b',
    'last (semester|summer|year|term|spring|fall|winter|month)',
    'at (my|the|a)\\b',
    'in (my|our|a|the)[^.]{0,28}(role|class|internship|job|team|project|course|company|org)',
    'we were', 'i was (working|interning|on|part of|the|assigned|running|leading)',
    'my (team|group|manager|professor|client|company|ward|first|last|previous)',
    'our (team|group|client|project|company|class|org)',
    'there was', 'i (ran|led|was on)\\b', 'for (a|my|our|the)[^.]{0,24}(project|client|class)'
  ],

  /* Task: is it clear what THEY were on the hook for, or what the problem was? */
  task: [
    'my (job|task|role|responsibility|goal|part|assignment)',
    '\\b(i|we) (had to|needed to|wanted to|was|were) ',
    '\\bhad to\\b', '\\bneeded to\\b', '\\bwanted to\\b',
    'i was (asked|assigned|responsible|tasked|supposed|expected)',
    'responsible for', 'i owned', 'it was (on me|my)',
    'the (goal|challenge|problem|issue|task|ask|question|tension|risk) was',
    'was to\\b', 'about whether', 'the deadline', 'so that we'
  ],

  /* Action: concrete first-person verbs. This is the part candidates do best. */
  action: [
    '\\bi (built|wrote|created|ran|set up|proposed|organi[sz]ed|led|asked|met|' +
    'reached out|analy[sz]ed|tested|designed|documented|scheduled|reviewed|' +
    'mapped|escalated|suggested|implemented|decided|changed|started|split|' +
    'timeboxed|interviewed|checked|fixed|automated|presented|rebuilt|moved|' +
    'added|removed|spent|showed|gave|brought|pushed|pulled|found|used|made|' +
    'went|sat|walked|framed|reframed|counted|measured|logged|filed|drafted)\\b',
    'so i ', 'i decided', 'my approach', 'what i did', 'i took', 'instead of',
    'i did not', "i didn'?t", 'rather than[^.]{0,30}i '
  ],

  /* Result: did the story land somewhere? Includes outcome verbs and deltas. */
  result: [
    'as a result', 'result(ed|ing)? in',
    '(we|it|they|that) (shipped|delivered|launched|finished|landed|completed|' +
    'reduced|increased|saved|avoided|adopted|approved|accepted|used|worked|' +
    'stopped|passed|ran|went|submitted|agreed|dropped|rose|fell|improved)',
    'ended up', 'in the end', 'the outcome', 'we were able to', 'it worked',
    'went from', '\\bfrom \\d+[^.]{0,18}to \\d+', 'on time', 'ahead of schedule',
    'improved', 'reduced', 'increased', 'saved', 'cut ', 'lifted', 'stopped',
    'they (approved|adopted|used|accepted|took|picked|chose)',
    '\\d+%', 'no longer', 'has not', "hasn'?t", 'since then', 'still (running|used)'
  ],

  /* Learning: the closing reflection. Scored as a bonus dimension. */
  learning: [
    'i learned', 'what i (took|learned|kept)', 'the lesson', 'since then',
    'i now ', 'it taught me', 'going forward', 'what that (taught|showed)',
    'i started ', 'that is now', 'i (try|aim) to', 'what i carry', 'the habit'
  ]
};

const HEDGES = [
  '\\bi think\\b', '\\bi guess\\b', '\\bkind of\\b', '\\bsort of\\b',
  '\\bmaybe\\b', '\\bprobably\\b', '\\bjust\\b', '\\bbasically\\b',
  '\\bi feel like\\b', '\\bor something\\b', '\\bstuff\\b', '\\bthings like that\\b'
];

/* ---------- behavioral --------------------------------------------------- */

function analyseBehavioral(text) {
  const n = words(text).length;
  const dims = [];

  /* 1. STAR completeness ------------------------------------------------- */
  const present = {};
  ['situation', 'task', 'action', 'result'].forEach(function (k) {
    present[k] = hasAny(text, STAR_CUES[k]);
  });
  const missing = Object.keys(present).filter(function (k) { return !present[k]; });
  const starHits = 4 - missing.length;

  const nameOf = {
    situation: 'Situation (where and when this happened)',
    task: 'Task (what you specifically were responsible for)',
    action: 'Action (the steps you personally took)',
    result: 'Result (how it turned out)'
  };

  dims.push({
    name: 'STAR structure',
    weight: 3,
    state: starHits === 4 ? 'ok' : starHits >= 2 ? 'mid' : 'gap',
    note:
      starHits === 4
        ? 'All four parts are present. An interviewer can follow this without asking follow-ups.'
        : 'Missing: ' + missing.map(function (k) { return nameOf[k]; }).join('; ') +
          '. Interviewers use STAR to score you - a missing part usually reads as a vague answer.'
  });

  /* 2. Ownership: "I" vs "we" -------------------------------------------- */
  const iCount = countMatches(text, '\\bi\\b');
  const weCount = countMatches(text, '\\b(we|our|us)\\b');
  const ownership = iCount + weCount === 0 ? 0 : iCount / (iCount + weCount);

  dims.push({
    name: 'Ownership',
    weight: 2,
    state: ownership >= 0.45 ? 'ok' : ownership >= 0.25 ? 'mid' : 'gap',
    note:
      ownership >= 0.45
        ? 'You said "I" ' + iCount + ' times against "we" ' + weCount +
          '. Your own contribution is clear.'
        : 'You said "we/our" ' + weCount + ' times but "I" only ' + iCount +
          '. The interviewer is hiring you, not your team - convert at least two ' +
          '"we" statements into what you personally did.'
  });

  /* 3. Specificity: numbers and named detail ------------------------------
     Counts digits AND spelled-out numbers, because people write "three days"
     as often as "3 days". "one" is deliberately excluded - it is far more
     often a pronoun ("one of them") than a quantity. */
  const numbers =
    countMatches(text, '\\b\\d+([.,]\\d+)?%?\\b') +
    countMatches(text,
      '\\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|' +
      'fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|' +
      'hundred|thousand|dozen|half|twice|three-quarters)\\b');
  dims.push({
    name: 'Specific evidence',
    weight: 2,
    state: numbers >= 2 ? 'ok' : numbers === 1 ? 'mid' : 'gap',
    note:
      numbers >= 2
        ? 'You used ' + numbers + ' concrete quantities. That is what makes a story ' +
          'sound like it happened.'
        : numbers === 1
        ? 'You used one number. Add a second - how long it took, how many people, ' +
          'or how much the result moved.'
        : 'No numbers anywhere. Add at least one: how many users, how many hours, ' +
          'what percent it improved. Unquantified stories are indistinguishable ' +
          'from hypothetical ones.'
  });

  /* 4. Length ------------------------------------------------------------- */
  dims.push({
    name: 'Length',
    weight: 1,
    state: n >= 90 && n <= 260 ? 'ok' : n >= 55 && n <= 340 ? 'mid' : 'gap',
    note:
      n < 55
        ? n + ' words. Too short to carry a full story - aim for 90-260 words, ' +
          'roughly 60-90 seconds spoken.'
        : n < 90
        ? n + ' words - about ' + Math.round(n / 2.6) + ' seconds spoken. A little ' +
          'thin for a story answer. One more sentence on what you actually did, or ' +
          'on the result, gets you into the 90-260 range interviewers expect.'
        : n > 340
        ? n + ' words. This runs past two minutes spoken and interviewers start ' +
          'skimming. Cut the setup, keep the action and result.'
        : n > 260
        ? n + ' words. Slightly long - trim the setup so the action and result ' +
          'arrive sooner.'
        : n + ' words - about ' + Math.round(n / 2.6) + ' seconds spoken. Good range.'
  });

  /* 5. Hedging ------------------------------------------------------------ */
  let hedges = 0;
  HEDGES.forEach(function (h) { hedges += countMatches(text, h); });
  const hedgeRate = n === 0 ? 0 : hedges / n;
  dims.push({
    name: 'Confidence',
    weight: 1,
    state: hedgeRate < 0.012 ? 'ok' : hedgeRate < 0.03 ? 'mid' : 'gap',
    note:
      hedges === 0
        ? 'No hedging language. You sound like you are describing something you did.'
        : hedges + ' hedging phrase' + (hedges === 1 ? '' : 's') +
          ' ("I think", "kind of", "just", "maybe"). Each one quietly ' +
          'undercuts the claim it is attached to - delete them and the same ' +
          'sentence reads as expertise.'
  });

  /* 6. Reflection (bonus, not penalised heavily) -------------------------- */
  const reflects = hasAny(text, STAR_CUES.learning);
  dims.push({
    name: 'Reflection',
    weight: 1,
    state: reflects ? 'ok' : 'mid',
    note: reflects
      ? 'You closed with what you learned. Strong finish - this is what the ' +
        'interviewer writes down.'
      : 'No explicit takeaway. One closing sentence - "what I took from that is..." ' +
        '- is the cheapest upgrade available on any behavioral answer.'
  });

  return finalise(dims, text);
}

/* ---------- approach / process questions ---------------------------------

   NOT every behavioral question is a story question. "How do you stay
   organised?" and "How would you communicate risk?" ask for a method, not an
   anecdote - so scoring them against STAR and demanding a metric produces
   feedback that is simply wrong, and users correctly stop trusting it.

   We classify from the question wording: "Tell me about a time", "Describe a
   time", "Name a challenge" and past-tense "How have you..." want a story.
   "How do you", "How would you", "What is your process" want an approach.
   -------------------------------------------------------------------------- */

const STORY_MARKERS = [
  '^tell me about', '^describe a', '^describe the time', '^name a',
  '^give me an example', '^discuss a', '^walk (me|us) through a',
  '^talk (me|us) through a', '\\ba time\\b', '\\ba situation (in )?which',
  '^how have you', '^what (is|was) the biggest challenge you have',
  'favourite|favorite', '^explain your'
  /* Deliberately NOT here: "what motivated you", "what led you into X".
     Those are journey questions - the useful rubric is a stated direction
     backed by concrete evidence, not Situation/Task/Action/Result. */
];

function isStoryQuestion(question) {
  if (question.mode) return question.mode === 'story';
  const q = (question.q || '').trim().toLowerCase();
  return hasAny(q, STORY_MARKERS);
}

function analyseApproach(text) {
  const n = words(text).length;
  const dims = [];

  /* 1. Is there a stated stance / principle / criteria? ------------------- */
  const stance = hasAny(text, [
    'my (approach|rule|principle|default|process|framework|habit|instinct|first move|working assumption)',
    'i (always|never|start|begin|try to|treat|assume|prefer|aim to|make a point|keep|maintain|run|use|used|got into|came to)',
    'the (way|thing|first thing|one thing|main thing) i',
    'the (first|one) thing i (do|would)', 'i would (start|not)', 'what i would not',
    '\\b(two|three|four|five) things\\b', 'the (three|two|four)\\b',
    'i think about it as', 'the criteria', 'i separate', 'the failure mode',
    'mostly by', 'rather than', 'first,', '^first\\b'
  ]);
  dims.push({
    name: 'Stated approach',
    weight: 3,
    state: stance ? 'ok' : 'gap',
    note: stance
      ? 'You lead with a stated method rather than a list of adjectives. That is ' +
        'what this question is actually asking for.'
      : 'No explicit method. This question wants a repeatable approach - open with ' +
        'one sentence naming it ("my rule is...", "I start by..."), then support it. ' +
        'Without that, the answer reads as improvised.'
  });

  /* 2. Concrete practice - a named artifact, tool, or step ---------------- */
  const artifact = hasAny(text, [
    'checklist', 'template', 'log\\b', 'register', 'matrix', 'glossary', 'one-?page',
    'document', 'agenda', 'retro', 'stand-?up', 'sync', 'dashboard', 'ticket',
    'jira', 'confluence', 'trailhead', 'figma', 'excel', 'spreadsheet', 'notion',
    'scope (document|statement)', 'decision log', 'risk register', 'pr template',
    'definition of done', 'acceptance criteria', 'runbook', 'playbook', 'cadence',
    'weekly', 'daily', 'every (day|week|sprint)', 'newsletter', 'user group',
    '\\b\\d+\\b', '\\b(two|three|four|five|six)\\b'
  ]);
  dims.push({
    name: 'Concrete practice',
    weight: 2,
    state: artifact ? 'ok' : 'gap',
    note: artifact
      ? 'You named something specific - an artifact, tool or cadence. That is what ' +
        'makes an approach answer credible instead of aspirational.'
      : 'Everything here is abstract. Name the actual thing you use: a decision log, ' +
        'a PR checklist, a weekly sync, a specific tool. Interviewers cannot tell ' +
        'the difference between someone who does this and someone who has read ' +
        'about it unless you name the artifact.'
  });

  /* 3. Grounded in a real instance --------------------------------------- */
  const grounded = hasAny(text, [
    'for example', 'for instance', 'e\\.g\\.', 'on (my|our|one) (project|team|internship|class)',
    'last (semester|summer|year|term)', 'in my (class|internship|role|job)',
    'when i ', 'i did this when', 'concretely', 'one time', 'we had',
    'on that project', 'at my'
  ]);
  dims.push({
    name: 'Grounded in a real instance',
    weight: 2,
    state: grounded ? 'ok' : 'mid',
    note: grounded
      ? 'You anchored the method in something that actually happened. Strong - this ' +
        'is the part most candidates skip on a "how do you" question.'
      : 'You described the method but never showed it working. Add one sentence: ' +
        '"for example, on my class project I..." Interviewers treat an ungrounded ' +
        'method as a guess about how you would behave, not evidence.'
  });

  /* 4. Structure ---------------------------------------------------------- */
  const sentences = text.split(/[.!?]+/).filter(function (x) {
    return words(x).length > 3;
  }).length;
  const structured = sentences >= 3 && hasAny(text, [
    'first', 'second', 'third', 'then', 'next', 'finally', 'after that',
    'the other', 'and then', 'beyond that', 'more importantly', 'the habit',
    'because', 'so that', 'rather than', 'instead of'
  ]);
  dims.push({
    name: 'Structure',
    weight: 1,
    state: structured ? 'ok' : sentences >= 3 ? 'mid' : 'gap',
    note: structured
      ? 'Sequenced and easy to follow spoken aloud.'
      : sentences >= 3
      ? 'The points are there but unsignposted. "There are three things I do - ' +
        'first... second... third..." makes an approach answer far easier to follow.'
      : 'Too short to have a structure. An approach answer wants the method, a ' +
        'concrete practice, and an example.'
  });

  /* 5. Length ------------------------------------------------------------- */
  dims.push({
    name: 'Length',
    weight: 1,
    state: n >= 80 && n <= 250 ? 'ok' : n >= 45 && n <= 320 ? 'mid' : 'gap',
    note:
      n < 45
        ? n + ' words. Too thin to describe a method and show it working.'
        : n < 80
        ? n + ' words - about ' + Math.round(n / 2.6) + ' seconds spoken. You have ' +
          'stated the method but not shown it. Add the example.'
        : n > 320
        ? n + ' words. Past ninety seconds spoken. Cut to the method plus one example.'
        : n > 250
        ? n + ' words. Slightly long - keep the method and one example, cut the rest.'
        : n + ' words - about ' + Math.round(n / 2.6) + ' seconds spoken. Good range.'
  });

  /* 6. Hedging ------------------------------------------------------------ */
  let hedges = 0;
  HEDGES.forEach(function (h) { hedges += countMatches(text, h); });
  const hedgeRate = n === 0 ? 0 : hedges / n;
  dims.push({
    name: 'Confidence',
    weight: 1,
    state: hedgeRate < 0.012 ? 'ok' : hedgeRate < 0.03 ? 'mid' : 'gap',
    note: hedges === 0
      ? 'No hedging language. You sound like someone who does this, not someone ' +
        'guessing at it.'
      : hedges + ' hedging phrase' + (hedges === 1 ? '' : 's') +
        ' ("I think", "kind of", "just", "maybe"). On a method question these are ' +
        'especially costly - they make a process sound like a preference.'
  });

  return finalise(dims, text);
}

/* ---------- technical ---------------------------------------------------- */

function analyseTechnical(text, question) {
  const n = words(text).length;
  const dims = [];
  const concepts = question.concepts || [];

  const hit = [];
  const miss = [];
  concepts.forEach(function (c) {
    (hasAny(text, c.patterns) ? hit : miss).push(c.label);
  });

  const coverage = concepts.length === 0 ? 1 : hit.length / concepts.length;

  /* 1. Concept coverage - the core of the technical score ----------------- */
  dims.push({
    name: 'Concept coverage',
    weight: 4,
    state: coverage >= 0.7 ? 'ok' : coverage >= 0.4 ? 'mid' : 'gap',
    note:
      'You covered ' + hit.length + ' of ' + concepts.length +
      ' points interviewers listen for.' +
      (hit.length ? ' Hit: ' + hit.join('; ') + '.' : '') +
      (miss.length ? ' Missing: ' + miss.join('; ') + '.' : ' Nothing missing.')
  });

  /* 2. Did they give a concrete example / name a tool? -------------------- */
  const concrete = hasAny(text, [
    'for example', 'for instance', 'e\\.g\\.', 'such as', 'like when',
    'in my (project|class|internship)', 'i (used|built|ran|set up)', 'i have',
    'last (semester|summer)', 'say '
  ]);
  dims.push({
    name: 'Grounded in experience',
    weight: 1,
    state: concrete ? 'ok' : 'mid',
    note: concrete
      ? 'You tied the concept to something concrete. That is the difference ' +
        'between knowing a definition and having used it.'
      : 'This reads as a textbook answer. Add one clause - "for example, on my ' +
        'class project I..." - and it becomes evidence rather than recall.'
  });

  /* 3. Structure ---------------------------------------------------------- */
  const sentences = text.split(/[.!?]+/).filter(function (s) {
    return words(s).length > 3;
  }).length;
  const structured =
    sentences >= 3 &&
    hasAny(text, [
      'first', 'then', 'next', 'finally', 'start', 'after that', 'second',
      'the difference', 'whereas', 'on the other hand', 'because', 'so that',
      'the reason'
    ]);
  dims.push({
    name: 'Structure',
    weight: 1,
    state: structured ? 'ok' : sentences >= 3 ? 'mid' : 'gap',
    note: structured
      ? 'Your answer is sequenced with connective language, so it is easy to ' +
        'follow spoken aloud.'
      : sentences >= 3
      ? 'The content is there but it arrives as a list. Signpost it - "first... ' +
        'then... the thing that actually matters is..." - so a listener can track it.'
      : 'Too short to have a structure. Technical answers want a definition, an ' +
        'example, and a trade-off or caveat.'
  });

  /* 4. Length ------------------------------------------------------------- */
  /* The length note is written against coverage on purpose. Telling someone who
     named every expected point that they sound like they "do not know it" is
     both wrong and the kind of contradiction that makes feedback ignorable. */
  const terse = n < 70;
  dims.push({
    name: 'Length',
    weight: 1,
    state: n >= 70 && n <= 260 ? 'ok' : n >= 40 && n <= 340 ? 'mid' : 'gap',
    note:
      terse && coverage >= 0.7
        ? n + ' words. You named the right points but compressed them into a list. ' +
          'Give each one a sentence - in a real interview this lands as ' +
          'about ' + Math.round(n / 2.6) + ' seconds, which reads as rushing.'
        : n < 40
        ? n + ' words. Too thin - an interviewer will read this as "does not know it".'
        : n < 70
        ? n + ' words - about ' + Math.round(n / 2.6) + ' seconds spoken. Short for a ' +
          'technical answer. Add the example or the caveat you left out.'
        : n > 340
        ? n + ' words. Long enough that the key point gets buried. Lead with the ' +
          'direct answer, then elaborate.'
        : n > 260
        ? n + ' words. Slightly long - lead with the direct answer, then elaborate.'
        : n + ' words - about ' + Math.round(n / 2.6) + ' seconds spoken. Good range.'
  });

  return finalise(dims, text, miss);
}

/* ---------- scoring + "fix this first" ----------------------------------- */

const WEIGHT = { ok: 1, mid: 0.55, gap: 0 };

/* Dimensions are NOT equally important. Getting the expected technical points
   in matters more than word count; having all four STAR parts matters more
   than hedging. Each dim declares a weight and the score is a weighted mean,
   so a correct-but-terse answer is not scored the same as a fluent empty one. */

function finalise(dims, text, missingConcepts) {
  let earned = 0;
  let possible = 0;
  dims.forEach(function (d) {
    const w = d.weight || 1;
    earned += WEIGHT[d.state] * w;
    possible += w;
  });
  const pct = Math.round((earned / possible) * 100);

  let verdict;
  if (pct >= 82) verdict = 'Interview-ready';
  else if (pct >= 62) verdict = 'Solid, with one clear gap';
  else if (pct >= 40) verdict = 'Rough draft - the substance is there';
  else verdict = 'Needs another pass';

  /* Highest-leverage fix = the dimension where the most weighted score is
     currently being lost. That is a better recommendation than "the first
     failing check", because it points at what actually moves the number. */
  let target = null;
  let bestLoss = 0;
  dims.forEach(function (d) {
    const loss = (d.weight || 1) * (1 - WEIGHT[d.state]);
    if (loss > bestLoss) { bestLoss = loss; target = d; }
  });

  let fixFirst;
  if (!target) {
    fixFirst =
      'Nothing structural left to fix. Practise saying this out loud twice - ' +
      'written answers that score well often run long when spoken.';
  } else if (target.name === 'Concept coverage' && missingConcepts && missingConcepts.length) {
    fixFirst =
      'Work in the missing points, starting with "' + missingConcepts[0] +
      '". That one is the most commonly expected part of this answer.';
  } else {
    fixFirst = target.note;
  }

  return { pct: pct, verdict: verdict, dims: dims, fixFirst: fixFirst };
}

/* ---------- public entry point ------------------------------------------- */

function evaluateAnswer(text, question) {
  const clean = (text || '').trim();
  if (words(clean).length < 12) {
    return {
      pct: 0,
      verdict: 'Not enough to analyse',
      dims: [
        {
          name: 'Length',
          state: 'gap',
          note:
            'Write at least a couple of sentences. The point of this tool is that ' +
            'you attempt the answer badly here rather than in the actual interview.'
        }
      ],
      fixFirst:
        'Attempt a real answer, even a bad one. You can reveal the strong version ' +
        'afterwards - but reading it first is how you convince yourself you know ' +
        'something you cannot yet say out loud.'
    };
  }
  if (question.type === 'technical') return analyseTechnical(clean, question);
  return isStoryQuestion(question)
    ? analyseBehavioral(clean)
    : analyseApproach(clean);
}
