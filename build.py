#!/usr/bin/env python3
"""
Build the single-file deliverable.

WHY A BUILD STEP AT ALL
-----------------------
The case requires "an HTML file that can be run on any browser" - one file, no
server. But one 4,000-line file is impossible for four people to edit at once
without constant merge conflicts.

So we author in src/ (each person owns different files) and concatenate into
index.html. The output has no dependencies, no CDN links and no network calls,
so it runs from a file:// URL and works offline during the recorded demo.

USAGE
-----
    python3 build.py

Re-run after editing anything in src/. index.html is committed to the repo so
teammates who cannot run the script always have a working copy.
"""

import pathlib
import sys

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"

# Order matters: data and helpers must be defined before app.js runs.
CSS_FILES = [
    "css/tokens.css",
    "css/app.css",
]

JS_FILES = [
    "data/icons.js",      # icon() helper
    "data/careers.js",    # CAREERS, DEPARTMENT_STATS, FIT_QUESTIONS
    "data/questions.js",  # QUESTIONS
    "js/feedback.js",     # evaluateAnswer()
    "js/app.js",          # renders and wires everything; must be last
]


def read(rel):
    path = SRC / rel
    if not path.exists():
        sys.exit("build failed: missing %s" % path)
    return path.read_text(encoding="utf-8")


def banner(rel):
    line = "=" * 74
    return "/* %s\n   SOURCE: src/%s\n   %s */\n" % (line, rel, line)


def main():
    template = read("template.html")

    css = "\n\n".join(banner(f) + read(f) for f in CSS_FILES)
    js = "\n\n".join(banner(f) + read(f) for f in JS_FILES)

    if "/* <<<CSS>>> */" not in template or "/* <<<JS>>> */" not in template:
        sys.exit("build failed: template.html is missing a placeholder")

    html = template.replace("/* <<<CSS>>> */", css).replace("/* <<<JS>>> */", js)

    # Guard the two things that would silently break the deliverable.
    for bad, why in [
        ("<script src=", "external script tag - the file must be self-contained"),
        ("<link rel=\"stylesheet\"", "external stylesheet - the file must be self-contained"),
        ("http://", "insecure URL"),
    ]:
        if bad in html:
            sys.exit("build failed: found %s (%s)" % (bad, why))

    OUT.write_text(html, encoding="utf-8")

    kb = len(html.encode("utf-8")) / 1024
    print("built %s  (%.1f KB, %d lines)" % (OUT.name, kb, html.count("\n") + 1))
    print("open it with:  open index.html      (or drag it into a browser)")


if __name__ == "__main__":
    main()
