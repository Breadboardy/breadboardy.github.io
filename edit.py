#!/usr/bin/env python3
"""
Local editing server for the portfolio.

    python3 edit.py          then open http://localhost:8111

Serves the site exactly like a normal static server, and adds two endpoints
the in-page editor talks to:

    POST /api/save   apply a list of field edits to js/data.js
    POST /api/add    append a new log entry / project / award / talk

Edits are applied SURGICALLY — it finds the exact quoted string for one field
and swaps it, leaving every comment and every bit of formatting in data.js
untouched. It never regenerates the file.

Nothing here runs on GitHub Pages. This is a local writing tool only.
"""

import json, re, shutil, sys, datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "js" / "data.js"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8111


# ---------------------------------------------------------------- scanning
# data.js is full of comments that contain braces, quotes and apostrophes
# ("copy one { ... } block", "you're"). A naive regex walks straight into them,
# so everything below skips strings and comments properly.

def _skip(src, i):
    """If src[i] starts a string or comment, return the index just past it."""
    c = src[i]
    if c in "\"'":
        j = i + 1
        while j < len(src):
            if src[j] == "\\":
                j += 2
                continue
            if src[j] == c:
                return j + 1
            j += 1
        return len(src)
    if src.startswith("//", i):
        j = src.find("\n", i)
        return len(src) if j < 0 else j
    if src.startswith("/*", i):
        j = src.find("*/", i)
        return len(src) if j < 0 else j + 2
    return None


def find_body(src, header):
    """Span of the [...] or {...} body that `header` opens (header ends in [ or {)."""
    i = src.index(header)
    j = i + len(header) - 1
    opener = src[j]
    closer = "]" if opener == "[" else "}"
    depth, k = 0, j
    while k < len(src):
        nxt = _skip(src, k)
        if nxt is not None:
            k = nxt
            continue
        if src[k] == opener:
            depth += 1
        elif src[k] == closer:
            depth -= 1
            if depth == 0:
                return j, k
        k += 1
    raise ValueError(f"unbalanced block after {header!r}")


def array_items(src, start, end):
    """Spans of each top-level {...} inside an array body."""
    items, depth, k, obj_start = [], 0, start + 1, None
    while k < end:
        nxt = _skip(src, k)
        if nxt is not None:
            k = min(nxt, end)
            continue
        if src[k] == "{":
            if depth == 0:
                obj_start = k
            depth += 1
        elif src[k] == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                items.append((obj_start, k))
                obj_start = None
        k += 1
    return items


def object_strings(src, start, end):
    """{field: (value_start, value_end)} for direct string properties of one object."""
    out, depth, k = {}, 0, start + 1
    while k < end:
        nxt = _skip(src, k)
        if nxt is not None:
            k = nxt
            continue
        ch = src[k]
        if ch in "{[":
            depth += 1
        elif ch in "}]":
            depth -= 1
        elif depth == 0:
            m = re.match(r"([A-Za-z_$][\w$]*)\s*:\s*", src[k:end])
            if m:
                vstart = k + m.end()
                if vstart < end and src[vstart] == '"':
                    vend = _skip(src, vstart)
                    out[m.group(1)] = (vstart, vend)
                    k = vend
                    continue
        k += 1
    return out


def js_string(value):
    """Encode a Python string as a double-quoted JS literal on one line."""
    return json.dumps(str(value), ensure_ascii=False)


# ---------------------------------------------------------------- editing

COLLECTIONS = {
    "PROJECTS":  "const PROJECTS = [",
    "LOG":       "const LOG = [",
    "TALKS":     "const TALKS = [",
    "EDUCATION": "const EDUCATION = [",
    "AWARDS":    "const AWARDS = [",
    "LANGUAGES": "const LANGUAGES = [",
}
OBJECTS = {"SITE": "const SITE = {", "PROFILE": "const PROFILE = {"}


def locate(src, spec):
    """Return (value_start, value_end) for one edit spec, or None."""
    target, field = spec["target"], spec["field"]

    if target in OBJECTS:
        s, e = find_body(src, OBJECTS[target])
        return object_strings(src, s, e).get(field)

    if target not in COLLECTIONS:
        raise KeyError(f"unknown target {target!r}")

    s, e = find_body(src, COLLECTIONS[target])
    items = array_items(src, s, e)

    if "key" in spec and spec["key"] is not None:          # address a project by id
        for a, b in items:
            fields = object_strings(src, a, b)
            idf = fields.get("id")
            if idf and json.loads(src[idf[0]:idf[1]]) == spec["key"]:
                return object_strings(src, a, b).get(field)
        return None

    idx = int(spec.get("index", 0))
    if idx >= len(items):
        return None
    a, b = items[idx]
    return object_strings(src, a, b).get(field)


def apply_edits(src, edits):
    """Apply every edit. Done back-to-front so earlier offsets stay valid."""
    located = []
    for spec in edits:
        span = locate(src, spec)
        if span is None:
            raise KeyError(f"no field {spec.get('target')}.{spec.get('field')}")
        located.append((span, spec["value"]))

    located.sort(key=lambda t: t[0][0], reverse=True)
    for (vs, ve), value in located:
        # textareas collect stray leading/trailing whitespace; don't store it
        src = src[:vs] + js_string(str(value).strip()) + src[ve:]
    return src


# ---------------------------------------------------------------- adding

TEMPLATES = {
    "log": '''
  {{
    date: "{today}",
    title: "",
    body:  ""
  }},
''',
    "project": '''
  {{
    id:      "new-project-{today}",
    name:    "New project",
    tagline: "",
    tags:    [],
    status:  "in progress",
    started: "{year}",
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "",
    firstTry:  "",
    wentWrong: "",
    changed:   "",
    nowDoes:   "",
    next:      ""
  }},
''',
    "award": '''
  {{
    title:  "",
    org:    "",
    date:   "{today}",
    url:    "",
    detail: ""
  }},
''',
    "talk": '''
  {{
    title: "",
    project: "",
    date: "{today}",
    url: "",
    thumb: "",
    blurb: ""
  }},
''',
}
WHERE = {"log": "LOG", "project": "PROJECTS", "award": "AWARDS", "talk": "TALKS"}


def add_item(src, kind, today):
    if kind not in TEMPLATES:
        raise KeyError(f"cannot add {kind!r}")
    block = TEMPLATES[kind].format(today=today, year=today[:4]).rstrip("\n")
    s, e = find_body(src, COLLECTIONS[WHERE[kind]])
    items = array_items(src, s, e)

    if kind == "log":                       # newest first
        at = items[0][0] if items else s + 1
        return src[:at].rstrip() + ("\n" if items else "") + block.lstrip("\n") + \
               ("\n" + src[at:] if items else src[at:])

    at = items[-1][1] + 1 if items else s + 1   # everything else appends
    tail = src[at:]
    sep = "" if tail.lstrip().startswith(",") else ","
    return src[:at] + sep + "\n" + block.lstrip("\n").rstrip(",\n") + tail


# ---------------------------------------------------------------- server

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, fmt, *args):
        if "api/" in (args[0] if args else ""):
            sys.stderr.write("  %s\n" % (fmt % args))

    def _json(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        if self.command == "GET":
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        if self.path not in ("/api/save", "/api/add"):
            return self._json(404, {"ok": False, "error": "no such endpoint"})
        try:
            n = int(self.headers.get("Content-Length") or 0)
            payload = json.loads(self.rfile.read(n) or b"{}")
            src = DATA.read_text()
            today = datetime.date.today().isoformat()

            if self.path == "/api/save":
                edits = payload.get("edits", [])
                new = apply_edits(src, edits)
                changed = len(edits)
                what = f"{changed} field{'' if changed == 1 else 's'}"
            else:
                kind = payload.get("kind", "log")
                new = add_item(src, kind, today)
                what = f"new {kind}"

            if new != src:
                shutil.copy2(DATA, DATA.with_suffix(".js.bak"))   # always keep one undo
                DATA.write_text(new)
            print(f"  saved: {what}")
            self._json(200, {"ok": True, "message": what})
        except Exception as exc:
            print(f"  FAILED: {exc}")
            self._json(400, {"ok": False, "error": str(exc)})


if __name__ == "__main__":
    print(f"\n  portfolio editor  →  http://localhost:{PORT}")
    print(f"  writing to        →  {DATA}")
    print(f"  backup each save  →  {DATA.with_suffix('.js.bak')}")
    print("  ctrl-c to stop\n")
    try:
        ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\n  stopped\n")
