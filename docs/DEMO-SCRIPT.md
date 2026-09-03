# 5-Minute Video Script

**Hard limit: 5:00.** The rubric wants *"all members communicate clearly and
confidently"* and *"demo runs smoothly."* Rehearse once with a timer before
recording. Cut the intro before you cut the demo.

Four speakers, roughly 70 seconds each. Put names in the brackets tonight.

---

## 0:00 – 0:35 — The problem  *(Speaker 1: __________)*

> "IS students report two problems: they don't know what careers the degree leads
> to, and they're underprepared for interviews. Those compound — you can't
> prepare for a job you don't know exists. The STEM fair is on 17 September, so
> this is a two-week problem, not a next-year problem.
>
> We built the IS Career Launchpad: twelve career paths, and a mock interview
> tool covering all twelve. It's one HTML file — no server, no database, no
> internet connection. What you're about to see runs entirely offline."

*Screen: the landing page.*

---

## 0:35 – 1:45 — Module 1, Career Discovery  *(Speaker 2: __________)*

Show, in this order:

1. **The twelve paths grid.** "The case asked for four. We covered twelve,
   spanning building, analysing, securing, advising and leading."
2. **Click Cybersecurity.** Walk the five sections: day-to-day, skills, what an
   intern is expected to have, pay and growth, what makes a strong candidate.
3. **Point at the sources panel.** "Every figure links to where it came from."

Then the differentiator — **this is the most important 20 seconds of the video:**

> "Here's what makes this different from Googling. Scroll to the pay chart.
>
> If you Google 'software developer salary' you get $135,040. That's the BLS
> median — and it pools twenty-year veterans with people who started last month.
> The navy bar is what BYU IS graduates *actually* averaged as a starting salary:
> $72,487, class of 2025.
>
> A student who only Googles walks into a negotiation anchored on the wrong
> number. We show both and name the gap — and the gap is why growth rate, not
> starting pay, is the number that matters when you're 21."

Then, briefly:

> "We also label where our confidence is weaker. Six of these twelve roles have
> no single BLS occupation code, so their numbers come from salary guides. Those
> are marked 'industry est.' We're not going to present a Robert Half range and a
> government survey as if they're the same kind of fact."

*Optional if time allows: run the Fit Finder in 15 seconds.*

---

## 1:45 – 3:15 — Module 2, Interview Prep  *(Speaker 3: __________)*

1. **Click through from a career** to show the modules are connected.
2. **Read the question and the source line.** "Every question here is either
   candidate-reported on Glassdoor or published in a hiring guide. None of them
   were invented — the source is printed under each one."
3. **Paste a deliberately weak answer** and press Get feedback. Have this ready
   in your clipboard; do not type it live.

   > *"I think we kind of just worked on it together and it was fine."*

   Score comes back around **17%**. Read the "Fix this first" box aloud.

4. **Paste a strong answer** and press Get feedback again. Score jumps to the
   mid-90s. Point at the dimension list.

> "Notice the feedback names the *specific* missing thing — which STAR component
> is absent, that you said 'we' five times and 'I' once. Not 'add more detail.'"

5. **Show a technical question.** "Technical answers are scored against an answer
   key of the points interviewers actually listen for. If you leave out fan-out
   on a SQL joins question, it tells you that by name."

6. **Click "Show a strong answer."** "This appears only after you've attempted
   yours. Reading the answer first is how you convince yourself you know
   something you can't actually say out loud."

---

## 3:15 – 4:20 — How it works  *(Speaker 4: __________)*

This section exists because the case says: *"If an evaluator asks how something
works and you cannot answer, that is a problem."* Get ahead of it.

> "There's no AI in the feedback engine. It's deterministic rule-based analysis,
> which means it works offline and we can explain every score.
>
> The key design decision was that not every behavioural question is a story
> question. 'Tell me about a time' wants STAR. 'How do you stay organised?' wants
> a method — scoring that against STAR and demanding a metric produces feedback
> that's confidently wrong. So the engine classifies the question first and
> applies one of three rubrics.
>
> **The honest part:** our first version had a real bug. An answer that covered
> six out of six required concepts scored 39%, because word count was weighted
> the same as substance. And the feedback contradicted itself — it said 'you
> named every point' right next to 'an interviewer will read this as *does not
> know it*.'
>
> We caught it by writing a regression test that scores all 72 of our own model
> answers and flags anything below 80. If the engine disagrees with its own gold
> standard, the engine is wrong. That took the mean from 83% to 93%.
>
> That's the real answer to 'when did AI give you bad output' — the code looked
> completely reasonable. What caught it was deciding in advance what correct
> meant and testing against it."

---

## 4:20 – 4:50 — What we'd build next  *(any speaker)*

Pick one, and say how you'd validate it:

> "With three more weeks: let students record spoken answers instead of typing,
> because the gap between what you can write and what you can say under pressure
> is the whole problem. We'd validate it by testing with ten students before
> building — if they don't practise out loud already, the feature is worthless."

---

## 4:50 – 5:00 — Close

> "Twelve paths, seventy-two sourced questions, feedback that names what's
> missing, in one file that runs offline. Thanks."

---

## Recording checklist

- [ ] Open `index.html` **before** you start recording; have it loaded
- [ ] Weak and strong answers already copied somewhere you can paste from
- [ ] Browser zoom at ~110% so text is readable in the recording
- [ ] Close notifications, extra tabs, Slack
- [ ] Test your microphone on a 10-second clip first
- [ ] Run through once with a timer before the real take
- [ ] Everyone speaks — the rubric checks for this explicitly

## Things that lose points

- Reading these paragraphs word for word. Know the beats, use your own words.
- Spending 90 seconds on the intro and rushing the demo.
- Saying "we used AI to build it" and stopping there. The case *encourages* AI —
  what earns marks is showing where it was wrong and how you caught it.
- Only one person talking.
