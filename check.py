#!/usr/bin/env python3
"""Reports what's still blank in js/data.js. Run it with ./check.sh"""
import re, pathlib, sys

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
projects = block(src, "const PROJECTS = [", "\n];")
chunks = re.split(r'\n\s*\{', projects)[1:]
print(f"\n{B}PROJECTS{N}")
for c in chunks:
    name = field(c, "name") or field(c, "id")
    done = sum(1 for k, _ in STEPS if written(c, k))
    todo += 6 - done
    pid = field(c, "id")
    mine = sum(1 for k, _ in STEPS
               if DRAFTS.get(f"PROJECTS|{pid}|{k}", "\x00") == field(c, k))
    if not done:
        tag = ""                                   # nothing written yet either way
    elif mine:
        tag = f"  {Y}{mine} still my words{N}"
    else:
        tag = f"  {G}all yours{N}"
    print(f"  {bar(done, 6)} {name:<18} {D}{done}/6 sections{N}{tag}")
    draft_total[0] += mine
    missing = [lbl for k, lbl in STEPS if not written(c, k)]
    if missing:
        print(f"      {D}needs: {', '.join(missing)}{N}")
    extras = [n for n in ("tagline", "repo", "demo") if not field(c, n)]
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
novid = [field(c, "name") for c in chunks if field(c, "id") not in covered]
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
