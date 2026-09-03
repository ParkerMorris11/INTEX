# Deploying to Vercel

The site is a single static `index.html` at the repo root. No build step, no
framework, no environment variables.

## Option A — Vercel dashboard (easiest, ~3 minutes)

1. Push this repo to GitHub (see below).
2. Go to <https://vercel.com/new> and sign in **with GitHub**.
3. Click **Import** next to `ParkerMorris11/INTEX`.
4. On the configure screen, leave everything at its default:
   - Framework Preset: **Other**
   - Build Command: *(empty)*
   - Output Directory: *(empty — it serves the repo root)*
   - Install Command: *(empty)*
5. Click **Deploy**.

You get a URL like `intex-xxxx.vercel.app`. Every push to the branch redeploys
it automatically.

## Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Accept the defaults; when it asks for the output directory, press Enter.

## Which branch does Vercel deploy?

By default, Vercel treats your repo's **default branch** as production. This
work is on `claude/byu-is-project-plan-oi8vuw`, so either:

- **Merge it into `main` first** (recommended before you submit), or
- In Vercel: Project → Settings → Git → change the Production Branch.

Vercel also builds a preview URL for every branch, so you will get a working
link either way — just make sure the link you submit is the one you tested.

## What `vercel.json` does

- `cleanUrls` — serves `/` without the `.html` suffix.
- `Permissions-Policy: camera=(self), microphone=(self)` — **this matters.**
  The interview module records video with `getUserMedia`. Some embedding
  contexts block camera access by default; this header explicitly allows the
  page to use the camera on its own origin.
- `X-Content-Type-Options` and `Referrer-Policy` — standard hardening.
- `Cache-Control: must-revalidate` on the HTML so a redeploy shows up
  immediately rather than serving a stale cached page during your demo.

## Before you record the demo

- [ ] Open the deployed URL and click through all four tabs
- [ ] Grant camera permission and record one answer end to end
- [ ] Check it on a phone — the layout is responsive down to 390px
- [ ] Confirm the hero image loads (it is fetched from Unsplash; see below)

## One thing to know about the hero image

The hero background pulls a photo from `images.unsplash.com`. On Vercel that is
fine. But if you ever demo by opening `index.html` from your laptop with no
internet, the photo will not load — the hero falls back to solid BYU navy, which
still looks correct, just without the photo.

If you would rather not depend on the network at all, download a campus photo,
put it in the repo, and change the URL in the `.hero` rule near the top of the
`<style>` block. There is already a comment marking that line.
