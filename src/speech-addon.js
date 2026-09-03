/* ==========================================================================
   SPOKEN-ANSWER SCORING
   --------------------------------------------------------------------------
   Transcribes what the student actually SAYS while the camera is recording,
   then scores that transcript with the same engine that scores typed answers,
   plus two dimensions that only exist for speech: filler words and pace.

   WHY IT MUST RUN DURING THE RECORDING
   The Web Speech API only transcribes a live microphone. It cannot be handed
   a finished video blob. So recognition starts when recording starts and
   stops when recording stops, running alongside MediaRecorder on the same
   microphone.

   BROWSER SUPPORT - state this plainly rather than letting it fail silently:
     - Chrome and Edge only. Firefox and Safari have no SpeechRecognition.
     - Needs a secure context (https, or localhost). The deployed site is fine.
     - Chrome streams the audio to Google for recognition, so it needs an
       internet connection. Opening the file offline records fine but will not
       transcribe.
   When any of that is missing the panel says so and the typed box still works.

   The transcript is editable on purpose. Speech recognition mishears things,
   and scoring a student on a transcription error would be unfair and would
   destroy their trust in the number.
   ========================================================================== */

(function () {
  'use strict';

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  var recognition = null;
  var finalText = '';
  var interimText = '';
  var startedAt = 0;
  var durationMs = 0;
  var listening = false;
  var wantListening = false;      // true between start and stop, survives auto-restart
  var transcripts = {};           // question key -> { text, seconds }
  var currentKey = null;
  var failure = '';

  /* ---------- capability report ------------------------------------------ */

  function unavailableReason() {
    if (!SR) {
      return 'This browser cannot transcribe speech. Chrome or Edge can. ' +
             'You can still record video, and you can still type your answer below.';
    }
    if (!window.isSecureContext) {
      return 'Transcription needs a secure page (https). It will work on the ' +
             'deployed site, but not on a file opened straight from disk.';
    }
    return '';
  }

  /* ---------- speech dimensions ------------------------------------------ */

  /* Curated so it does not punish normal speech. "like" and "actually" have
     legitimate uses, but at interview pace they are overwhelmingly filler. */
  var FILLERS = [
    '\\b(um+|uh+|er+|erm+|hmm+)\\b',
    '\\byou know\\b', '\\bi mean\\b', '\\bkind of\\b', '\\bsort of\\b',
    '\\blike\\b', '\\bbasically\\b', '\\bliterally\\b', '\\bactually\\b',
    '\\bstuff like that\\b', '\\bor whatever\\b', '\\bi guess\\b'
  ];

  function fillerDim(text, wordCount) {
    var n = 0;
    var api = window.LaunchpadFeedback;
    FILLERS.forEach(function (f) { n += api.countMatches(text, f); });
    var per100 = wordCount ? (n / wordCount) * 100 : 0;
    return {
      name: 'Filler words',
      weight: 2,
      state: per100 < 2 ? 'ok' : per100 < 4.5 ? 'mid' : 'gap',
      note: n === 0
        ? 'No filler words at all. That is rare and it is the single most ' +
          'noticeable thing about a confident answer.'
        : n + ' filler' + (n === 1 ? '' : 's') + ' in ' + wordCount + ' words (' +
          per100.toFixed(1) + ' per 100). ' +
          (per100 < 2
            ? 'Low enough that a listener will not notice.'
            : 'A listener starts noticing around 2 per 100. The fix is not talking ' +
              'faster, it is being comfortable with a silent pause instead of ' +
              'filling it.')
    };
  }

  function paceDim(wordCount, seconds) {
    if (!seconds || seconds < 3) {
      return {
        name: 'Pace', weight: 1, state: 'mid',
        note: 'Recording too short to judge pace.'
      };
    }
    var wpm = Math.round(wordCount / (seconds / 60));
    return {
      name: 'Pace',
      weight: 1,
      state: (wpm >= 110 && wpm <= 175) ? 'ok' : (wpm >= 90 && wpm <= 195) ? 'mid' : 'gap',
      note: wpm + ' words per minute over ' + Math.round(seconds) + ' seconds. ' +
        (wpm < 90
          ? 'Slower than conversational. Some of this may be long pauses while you think, ' +
            'which is fine in person but reads as hesitant on a recording.'
          : wpm < 110
          ? 'A little slow. Comfortable interview pace is roughly 110-175.'
          : wpm > 195
          ? 'Very fast. Nerves usually show up as speed before anything else - ' +
            'slowing down is the highest-leverage thing you can practise.'
          : wpm > 175
          ? 'Slightly fast, which usually means nerves. Aim for 110-175.'
          : 'Comfortable interview pace.')
    };
  }

  /* ---------- recognition lifecycle --------------------------------------- */

  function startRecognition() {
    if (!SR || unavailableReason()) return;
    stopRecognition(true);

    finalText = '';
    interimText = '';
    failure = '';
    startedAt = Date.now();
    wantListening = true;

    try {
      recognition = new SR();
    } catch (e) {
      failure = 'Could not start transcription (' + (e.name || 'error') + ').';
      paint();
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || 'en-US';

    recognition.onresult = function (ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var chunk = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalText += chunk + ' ';
        else interim += chunk;
      }
      interimText = interim;
      paint();
    };

    recognition.onerror = function (ev) {
      /* "no-speech" and "aborted" are normal and self-correcting; only surface
         the ones the student can actually act on. */
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        failure = 'Microphone access was blocked, so nothing could be transcribed.';
        wantListening = false;
      } else if (ev.error === 'network') {
        failure = 'Transcription needs an internet connection (Chrome sends the ' +
                  'audio out to be recognised). The video still recorded fine.';
        wantListening = false;
      }
      paint();
    };

    /* Chrome ends the session after a stretch of silence even in continuous
       mode. Restart while the student is still recording, or a long pause
       silently truncates their answer. */
    recognition.onend = function () {
      listening = false;
      if (wantListening) {
        try { recognition.start(); listening = true; } catch (e) { /* races on stop */ }
      }
      paint();
    };

    try {
      recognition.start();
      listening = true;
    } catch (e) {
      failure = 'Could not start transcription (' + (e.name || 'error') + ').';
    }
    paint();
  }

  function stopRecognition(silent) {
    wantListening = false;
    if (recognition) {
      try { recognition.stop(); } catch (e) { /* already stopped */ }
      try { recognition.abort(); } catch (e) { /* not always present */ }
    }
    recognition = null;
    listening = false;
    if (!silent) {
      durationMs = startedAt ? Date.now() - startedAt : 0;
      if (currentKey) {
        transcripts[currentKey] = {
          text: (finalText + ' ' + interimText).trim(),
          seconds: durationMs / 1000
        };
      }
      paint();
    }
  }

  /* ---------- UI ---------------------------------------------------------- */

  var PANEL = 'spoken-panel';

  function buildPanel() {
    if (document.getElementById(PANEL)) return;
    var anchor = document.getElementById('written-feedback-panel');
    if (!anchor || !anchor.parentNode) return;

    var wrap = document.createElement('div');
    wrap.id = PANEL;
    wrap.className = 'sp-wrap';
    anchor.parentNode.insertBefore(wrap, anchor);
    paint();
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function paint() {
    var wrap = document.getElementById(PANEL);
    if (!wrap) return;

    var reason = unavailableReason();
    if (reason) {
      wrap.innerHTML =
        '<div class="sp-head">What you said</div>' +
        '<p class="sp-note sp-warn">' + esc(reason) + '</p>';
      return;
    }

    var saved = currentKey ? transcripts[currentKey] : null;
    var live = (finalText + ' ' + interimText).trim();
    var showing = wantListening ? live : (saved ? saved.text : '');
    var wc = showing ? showing.split(/\s+/).filter(Boolean).length : 0;

    var body;
    if (wantListening) {
      body =
        '<div class="sp-live"><span class="sp-dot"></span>Listening' +
        (listening ? '' : ' (reconnecting)') + '</div>' +
        '<div class="sp-transcript sp-transcript--live">' +
          (showing ? esc(showing) : '<span class="sp-placeholder">Start talking and your words will appear here.</span>') +
        '</div>';
    } else if (saved && saved.text) {
      body =
        '<p class="sp-note">Transcribed from your recording. Speech recognition ' +
        'mishears things, so fix anything wrong before scoring &mdash; you should not ' +
        'lose marks for a transcription error.</p>' +
        '<textarea id="sp-text" class="sp-transcript sp-editable" rows="5">' +
          esc(saved.text) + '</textarea>' +
        '<div class="sp-meta"><span>' + wc + ' words in ' +
          Math.round(saved.seconds) + 's</span></div>' +
        '<div class="sp-actions">' +
          '<button type="button" class="btn-primary" id="sp-go">Score what I said</button>' +
        '</div>' +
        '<div id="sp-out"></div>';
    } else if (failure) {
      body = '<p class="sp-note sp-warn">' + esc(failure) + '</p>';
    } else {
      body = '<p class="sp-note">Press <strong>Record answer</strong> above and your ' +
             'spoken answer will be transcribed here, then scored the same way a ' +
             'typed answer is &mdash; plus filler words and pace.</p>';
    }

    wrap.innerHTML = '<div class="sp-head">What you said</div>' + body +
      (failure && saved ? '<p class="sp-note sp-warn">' + esc(failure) + '</p>' : '');

    var go = document.getElementById('sp-go');
    if (go) go.addEventListener('click', scoreSpoken);
  }

  function scoreSpoken() {
    var q = (typeof currentQuestions !== 'undefined' && currentQuestions)
      ? currentQuestions[currentIndex] : null;
    var api = window.LaunchpadFeedback;
    if (!q || !api) return;

    var box = document.getElementById('sp-text');
    var text = box ? box.value : '';
    var saved = currentKey ? transcripts[currentKey] : null;
    var seconds = saved ? saved.seconds : 0;

    if (currentKey) transcripts[currentKey] = { text: text, seconds: seconds };

    var base = api.evaluate(text, q);
    var out = document.getElementById('sp-out');

    /* Below the "not enough to analyse" floor the base result has a single
       dimension; adding pace and fillers to that would be noise. */
    if (base.pct === 0 && base.dims.length === 1) {
      out.innerHTML = api.render(base);
      return;
    }

    var wc = api.words(text).length;
    var full = api.rescoreWith(base, [fillerDim(text, wc), paceDim(wc, seconds)]);
    out.innerHTML = api.render(full);
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------- hook into the existing recorder ------------------------------ */

  function hook() {
    if (typeof window.beginCapture !== 'function' ||
        typeof window.finishRecording !== 'function' ||
        typeof window.loadQuestion !== 'function') return false;

    var origBegin = window.beginCapture;
    window.beginCapture = function (q) {
      var out = origBegin.apply(this, arguments);
      /* Only listen if the recorder actually started - beginCapture bails on
         several error paths and we must not leave recognition running. */
      try {
        if (q && typeof activeRecorder !== 'undefined' && activeRecorder) {
          currentKey = q.key;
          startRecognition();
        }
      } catch (e) { /* never break recording because of transcription */ }
      return out;
    };

    var origFinish = window.finishRecording;
    window.finishRecording = function (q) {
      try {
        currentKey = q ? q.key : currentKey;
        stopRecognition(false);
      } catch (e) { /* ignore */ }
      return origFinish.apply(this, arguments);
    };

    var origLoad = window.loadQuestion;
    window.loadQuestion = function () {
      var out = origLoad.apply(this, arguments);
      try {
        stopRecognition(true);
        var q = currentQuestions[currentIndex];
        currentKey = q ? q.key : null;
        finalText = '';
        interimText = '';
        failure = '';
        buildPanel();
        paint();
      } catch (e) { /* ignore */ }
      return out;
    };
    return true;
  }

  if (!hook()) document.addEventListener('DOMContentLoaded', hook);
})();
