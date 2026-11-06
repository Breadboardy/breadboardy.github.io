#!/usr/bin/env python3
"""Reports what's still blank in js/data.js. Run it with ./check.sh"""
import re, pathlib, sys, json

SRC = pathlib.Path(__file__).parent / "js" / "data.js"
DRAFTS_FILE = pathlib.Path(__file__).parent / "drafts.json"
try:
    import json as _json
    DRAFTS = _json.loads(DRAFTS_FILE.read_text())
except Exception:
    DRAFTS = {}
STR = r'"((?:[^"\\]|\\.)*)"'

G, Y, R, D, B = "\033[32m", "\033[33m", "\033[31m", "\033[2m", "\033[1m"
N = "\033[0m"

STEPS = [("goal", "what you were trying to do"), ("firstTry", "what you tried first"),
         ("wentWrong", "what went wrong"), ("changed", "what you changed"),
         ("nowDoes", "what it does now"), ("next", "what you'd do next")]


def block(text, start, end):
    i = text.find(start)
    return text[i + len(start): text.find(end, i)] if i >= 0 else ""


def field(blk, name):
    """Value of one string property, with JS escapes decoded (so a value
       containing \\n compares equal to the real newline it represents)."""
    m = re.search(r'\b' + name + r'\s*:\s*' + STR, blk, re.S)
    if not m:
        return ""
    try:
        import json as _j
        val = _j.loads('"' + m.group(1) + '"')
    except Exception:
        val = m.group(1)
    return val.strip()


def written(blk, name):
    """Like field(), but a value made only of "[? ... ]" notes counts as blank —
       the site strips those, so the checker must agree or the counts lie."""
    return re.sub(r"\[\?[^\]]*\]", "", field(blk, name)).strip()


def bar(done, total):
    filled = "#" * done + "." * (total - done)
    col = G if done == total else (Y if done else R)
    return f"{col}[{filled}]{N}"


src = SRC.read_text()
todo = 0
draft_total = [0]

# --- projects ---
# the same scanner the editor uses, because problems are objects nested inside
# each project and a regex split would cut a project into pieces at every one
import importlib.util as _iu
_spec = _iu.spec_from_file_location("ed", str(pathlib.Path(__file__).parent / "edit.py"))
_ed = _iu.module_from_spec(_spec); _spec.loader.exec_module(_ed)

def _val(a, b, name):
    sp = _ed.object_strings(src, a, b).get(name)
    return re.sub(r"\[\?[^\]]*\]", "", json.loads(src[sp[0]:sp[1]])).strip() if sp else ""

def _raw(a, b, name):
    sp = _ed.object_strings(src, a, b).get(name)
    return json.loads(src[sp[0]:sp[1]]).strip() if sp else ""

OVERVIEW = [("goal", "what you were trying to do"), ("firstTry", "how you started"),
            ("nowDoes", "what it does now"), ("next", "what you'd do next")]

_s, _e = _ed.find_body(src, "const PROJECTS = [")
print(f"\n{B}PROJECTS{N}")
for a, b in _ed.array_items(src, _s, _e):
    pid  = _raw(a, b, "id")
    name = _raw(a, b, "name") or pid
    done = sum(1 for k, _ in OVERVIEW if _val(a, b, k))

    probs, mine = [], 0
    for k, _ in OVERVIEW:
        if _raw(a, b, k) and DRAFTS.get(f"PROJECTS|{pid}|{k}") == _raw(a, b, k):
            mine += 1
    arr = _ed.prop_array(src, a, b, "problems")
    for i, (pa, pb) in enumerate(_ed.array_items(src, arr[0], arr[1]) if arr else []):
        t, w, f = _val(pa, pb, "title"), _val(pa, pb, "what"), _val(pa, pb, "fix")
        probs.append(bool(w and f))
        for fld in ("title", "what", "why", "fix"):
            r = _raw(pa, pb, fld)
            if r and DRAFTS.get(f"PROJECTS|{pid}|problems.{i}.{fld}") == r:
                mine += 1

    solved = sum(probs)
    total  = done + solved
    want   = len(OVERVIEW) + max(1, len(probs))
    todo  += (len(OVERVIEW) - done) + (len(probs) - solved if probs else 1)
    draft_total[0] += mine
    if not total:
        tag = ""
    elif mine:
        tag = f"  {Y}{mine} still my words{N}"
    else:
        tag = f"  {G}all yours{N}"
    print(f"  {bar(min(total, want), want)} {name:<18} {D}{done}/{len(OVERVIEW)} overview · "
          f"{solved}/{len(probs)} problem{'' if len(probs) == 1 else 's'} written{N}{tag}")
    missing = [lbl for k, lbl in OVERVIEW if not _val(a, b, k)]
    if missing:
        print(f"      {D}needs: {', '.join(missing)}{N}")
    if probs and solved < len(probs):
        print(f"      {D}{len(probs) - solved} problem(s) missing what-happened or the fix{N}")
    extras = [n for n in ("tagline", "repo", "demo") if not _raw(a, b, n)]
    if extras:
        print(f"      {D}no {', '.join(extras)} yet{N}")

# --- build log ---
log = block(src, "const LOG = [", "\n];")
entries = re.split(r'\n\s*\{', log)[1:]
written = [e for e in entries if field(e, "body")]
print(f"\n{B}BUILD LOG{N}")
print(f"  {len(written)} written, {len(entries) - len(written)} blank")
todo += len(entries) - len(written)
words = sum(len(field(e, 'body').split()) for e in written)
if written:
    print(f"  {D}{words} words total, {words // len(written)} per entry (aim 100-150){N}")

# --- talks ---
talks = block(src, "const TALKS = [", "\n];")
tchunks = re.split(r'\n\s*\{', talks)[1:]
filmed = [t for t in tchunks if field(t, "url")]
print(f"\n{B}TALKS & DEMOS{N}")
print(f"  {len(filmed)} filmed, {len(tchunks) - len(filmed)} to record")
covered = {field(t, "project") for t in filmed}
novid = [_raw(a, b, "name") or _raw(a, b, "id") for a, b in _ed.array_items(src, _s, _e)
         if _raw(a, b, "id") not in covered]
if novid:
    print(f"  {D}no video yet: {', '.join(novid)}{N}")
todo += len(tchunks) - len(filmed)

# --- profile ---
prof = block(src, "const PROFILE = {", "\n};")
pblank = [k for k in ("headline", "location", "openTo") if not field(prof, k)]
edu = re.split(r'\n\s*\{', block(src, "const EDUCATION = [", "\n];"))[1:]
edone = [e for e in edu if field(e, "what")]
awards = re.split(r'\n\s*\{', block(src, "const AWARDS = [", "\n];"))[1:]
adone = [a for a in awards if field(a, "title")]
langs = re.split(r'\n\s*\{', block(src, "const LANGUAGES = [", "\n];"))[1:]
lblank = [field(l, "name") for l in langs if not field(l, "level")]

print(f"\n{B}PROFILE{N}")
print(f"  {G}header filled in{N}" if not pblank else f"  {Y}blank: {', '.join(pblank)}{N}")
print(f"  education: {len(edone)}/{len(edu)} filled in")
print(f"  awards:    {len(adone)}/{len(awards)} filled in"
      + (f"  {D}<- highest-value section on the site{N}" if not adone else ""))
if lblank:
    print(f"  {D}no level set: {', '.join(lblank)}{N}")
todo += len(pblank) + (len(edu) - len(edone)) + (len(awards) - len(adone)) + len(lblank)

# --- site ---
site = block(src, "const SITE = {", "\n};")
blanks = [k for k in ("role", "intro", "now", "about", "github") if not field(site, k)]
print(f"\n{B}HOME / ABOUT{N}")
print(f"  {G}all filled in{N}" if not blanks else f"  {Y}blank: {', '.join(blanks)}{N}")
todo += len(blanks)

for k in ("about", "intro"):
    if field(site, k) and DRAFTS.get(f"SITE||{k}") == field(site, k):
        draft_total[0] += 1

aw = len(field(site, "about").split())
if aw:
    verdict = f"{G}good length{N}" if aw >= 250 else f"{Y}keep going{N}"
    print(f"  \"Hi, I'm Callum\": {aw} words  {verdict}  {D}(aim 250-500){N}")

# --- html sanity: a duplicate id silently blanks a page, so check for it ---
import glob as _glob
problems = []
for f in sorted(_glob.glob(str(pathlib.Path(__file__).parent / "*.html"))):
    html = pathlib.Path(f).read_text()
    for tag in re.findall(r"<[a-zA-Z][^>]*>", html):
        ids = re.findall(r'\bid\s*=\s*"([^"]*)"', tag)
        if len(ids) > 1:
            problems.append(f"{pathlib.Path(f).name}: <{tag.split()[0][1:]}> has {len(ids)} id attributes {ids}")
    seen = {}
    for i in re.findall(r'\bid\s*=\s*"([^"]*)"', html):
        seen[i] = seen.get(i, 0) + 1
    for i, n in seen.items():
        if n > 1:
            problems.append(f"{pathlib.Path(f).name}: id=\"{i}\" used {n} times")

print(f"\n{B}HTML{N}")
if problems:
    for pr in problems:
        print(f"  {R}{pr}{N}")
else:
    print(f"  {G}no duplicate ids{N}")

gaps = len(re.findall(r"\[\? ", src))
print(f"\n{B}DRAFTS{N}")
if draft_total[0] or gaps:
    if draft_total[0]:
        print(f"  {Y}{draft_total[0]} sections are still exactly as Claude drafted them{N}")
        print(f"  {D}rewrite them in your own words — that is the point of the site{N}")
    if gaps:
        print(f"  {Y}{gaps} [? ...] gaps only you can fill{N}")
else:
    print(f"  {G}everything is in your words{N}")

print(f"\n{B}{todo} things left to write.{N}\n" if todo else f"\n{G}{B}Nothing blank. Site is done.{N}\n")
sys.exit(0)
