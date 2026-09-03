# IS Career Launchpad

A career-exploration and interview-preparation tool for BYU Information Systems
students. Built for the **Junior Core Case Competition**.

> **This is student work.** It is not an official BYU Information Systems
> Department tool.

---

## Run it

Double-click **`index.html`**, or drag it into any browser.

That is the whole thing. One self-contained file — no server, no build step, no
database, no network calls. It runs from a `file://` URL, which means the demo
cannot fail because of wifi.

---

## What it does

**Module 1 — Career Path Discovery.** Twelve IS career paths (the case required
four). For each: what the job is day to day, the skills and tools, what an intern
or entry-level candidate is expected to have, pay and growth with the source
linked, and what makes a strong candidate. Plus a six-question **Fit Finder** and
a pay chart that puts national medians next to what BYU graduates *actually*
start on.

**Module 2 — Interview Prep.** Seventy-two questions across all twelve paths,
behavioural and technical, every one sourced from a candidate report or a hiring
guide. Attempt an answer, get structured feedback naming what is missing, then
compare against a strong version.

---

## Editing it

Do **not** edit `index.html` directly — it is generated. Edit `src/`, then:

```bash
python3 build.py
```

```
src/
├── template.html        shell, masthead, footer, disclosures
├── css/
│   ├── tokens.css       BYU brand colours + derived scales
│   └── app.css          layout and components
├── data/
│   ├── icons.js         12 inline SVG icons
│   ├── careers.js       12 careers, BYU stats, Fit Finder
│   └── questions.js     72 questions, answer keys, model answers
└── js/
    ├── feedback.js      the scoring engine
    └── app.js           state, rendering, events
```

Four people own different files on purpose, so you can work in parallel without
merge conflicts. `index.html` is committed as well, so anyone who cannot run
Python still has a working copy.

`build.py` refuses to build if an external script, external stylesheet, or
`http://` URL sneaks in — any of those would break the offline demo.

---

## Docs

| File | Read it when |
|---|---|
| **[docs/PLAN.md](docs/PLAN.md)** | **Start here.** What is left, who does what, and the schedule to the deadline |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Before the video — this is how you answer "explain how it works" |
| [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md) | When you record |
| [docs/SOURCES.md](docs/SOURCES.md) | When someone asks where a number came from |

---

## Design notes

Colours are the official BYU palette — Navy `#002E5D` and Royal `#0047BA` from
[brand.byu.edu](https://brand.byu.edu/brand-guidelines/colors/) — with the grey
ramp locked to Navy's hue so every neutral is visibly related to the brand
colour. Nothing was picked because it looked nice; every value in `tokens.css`
has its justification in a comment beside it.

No webfonts, no CDN, no external assets. System font stack only, so the file
stays self-contained and works offline.

---

## Known limits

- The feedback engine measures **how an answer is built**, not whether the facts
  in it are true. The UI states this plainly; that is why a model answer is
  provided for comparison.
- The model answers describe **invented projects**. They are labelled as such.
  Use the shape, not the details.
- Six of the twelve roles have no BLS occupation code; their salary figures come
  from industry guides and are marked *(industry est.)*. See
  [docs/SOURCES.md](docs/SOURCES.md) §3.
- Answers are not persisted — refreshing the page clears them.
- Salary data was retrieved 3 September 2026 and will go stale.
