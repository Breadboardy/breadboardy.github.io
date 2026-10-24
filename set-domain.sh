#!/bin/bash
# Point the site at a domain you own.
#     ./set-domain.sh callum.dev
#
# Does three things:
#   1. writes a CNAME file  (GitHub Pages reads this to serve your domain)
#   2. rewrites the og: tags to absolute URLs, so pasting the link into an
#      email or a message shows a preview card with your photo
#   3. records the domain in js/data.js
#
# Run it again any time to change the domain.

set -e
cd "$(dirname "$0")"

DOMAIN="${1#http*://}"          # tolerate someone pasting https://…
DOMAIN="${DOMAIN%%/*}"          # …and a trailing path

if [ -z "$DOMAIN" ]; then
  echo "usage: ./set-domain.sh yourdomain.com"; exit 1
fi
if [[ ! "$DOMAIN" =~ ^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
  echo "that doesn't look like a domain: $DOMAIN"; exit 1
fi

echo "$DOMAIN" > CNAME
echo "  CNAME        -> $DOMAIN"

python3 - "$DOMAIN" <<'PY'
import sys, pathlib, re
domain = sys.argv[1]
base = f"https://{domain}"

for f in pathlib.Path('.').glob('*.html'):
    if f.name == 'styles.html':
        continue
    s = f.read_text()
    page = '' if f.name == 'index.html' else f.name
    s = re.sub(r'(<meta property="og:image" content=")[^"]*(")',
               rf'\g<1>{base}/img/callum.jpg\g<2>', s)
    if 'og:url' in s:
        s = re.sub(r'(<meta property="og:url" content=")[^"]*(")',
                   rf'\g<1>{base}/{page}\g<2>', s)
    else:
        s = s.replace('<meta property="og:type" content="website">',
                      f'<meta property="og:url" content="{base}/{page}">\n'
                      '<meta property="og:type" content="website">')
    f.write_text(s)

d = pathlib.Path('js/data.js')
t = d.read_text()
t = re.sub(r'(\n  url:      )"[^"]*"', rf'\g<1>"{base}"', t)
d.write_text(t)
print(f"  og: tags     -> {base}/…")
print(f"  SITE.url     -> {base}")
PY

echo
echo "  Now point the domain at GitHub, at your registrar's DNS page:"
echo
echo "    Type   Name   Value"
echo "    A      @      185.199.108.153"
echo "    A      @      185.199.109.153"
echo "    A      @      185.199.110.153"
echo "    A      @      185.199.111.153"
echo "    CNAME  www    Breadboardy.github.io"
echo
echo "  DNS takes anywhere from 10 minutes to a few hours."
echo
echo "  Then, in order:"
echo "    1. ./deploy.sh"
echo "    2. check it resolved:   dig +short $DOMAIN"
echo "       (you want the four 185.199.x.153 addresses back)"
echo "    3. GitHub repo -> Settings -> Pages -> tick 'Enforce HTTPS'"
echo "       That box is greyed out until DNS resolves. It is free, and"
echo "       without it the site is served over plain http."
echo
