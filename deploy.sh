#!/bin/bash
# Put the site on the internet. Run it again any time to update it.
#
#     ./deploy.sh
#
# First run creates the GitHub repo and turns on Pages. Every run after that
# just pushes your changes. Nothing happens without you typing "yes".

set -e
cd "$(dirname "$0")"

REPO="Breadboardy.github.io"          # user site -> https://breadboardy.github.io
USER="Breadboardy"
NAME="Callum"
MAIL="203696281+Breadboardy@users.noreply.github.com"   # keeps your real address private

echo
echo "  ──────────── deploying the portfolio ────────────"
echo

# --- 1. how much is still unwritten? -------------------------------------
# check.py colours its output, so strip ANSI before matching
LEFT=$(python3 check.py 2>/dev/null | sed -r 's/\x1b\[[0-9;]*m//g' \
       | grep -oE '[0-9]+ things left' | grep -oE '^[0-9]+' || echo "?")
if [ "$LEFT" != "0" ] && [ "$LEFT" != "?" ]; then
  echo "  ⚠  $LEFT things on the site still say TODO."
  echo "     They will be visible to anyone who opens the link."
  echo "     (./check.sh lists them)"
  echo
fi

# --- 2. confirm ----------------------------------------------------------
LOWER=$(echo "$USER" | tr '[:upper:]' '[:lower:]')
if [ -f CNAME ]; then URL="https://$(cat CNAME)"; else URL="https://$LOWER.github.io"; fi
echo "  This publishes a PUBLIC website at:"
echo "      $URL"
echo
echo "  It will include your name, your photo, and your LinkedIn."
echo "  Anyone with the link can see it. Search engines can index it."
echo
read -r -p "  Type yes to publish: " OK
[ "$OK" = "yes" ] || { echo "  cancelled — nothing was published"; exit 0; }
echo

# --- 3. git ---------------------------------------------------------------
[ -d .git ] || git init -q
git config user.name  "$NAME"
git config user.email "$MAIL"

git add -A
if git diff --cached --quiet 2>/dev/null && git rev-parse HEAD >/dev/null 2>&1; then
  echo "  nothing changed since last deploy"
else
  git commit -q -m "Update portfolio" || git commit -q -m "Portfolio site"
  echo "  committed as $NAME <$MAIL>"
fi
git branch -M main

# --- 4. repo --------------------------------------------------------------
if ! gh repo view "$USER/$REPO" >/dev/null 2>&1; then
  echo "  creating github.com/$USER/$REPO (public)…"
  gh repo create "$REPO" --public --description "Things I build." --source=. --remote=origin
else
  git remote get-url origin >/dev/null 2>&1 || \
    git remote add origin "https://github.com/$USER/$REPO.git"
fi

echo "  pushing…"
git push -u origin main --quiet

# --- 5. pages -------------------------------------------------------------
if ! gh api "repos/$USER/$REPO/pages" >/dev/null 2>&1; then
  echo "  turning on GitHub Pages…"
  gh api -X POST "repos/$USER/$REPO/pages" \
     -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
     || echo "  (couldn't enable automatically — do it at repo Settings → Pages)"
fi

echo
echo "  done.  $URL"
echo "  first deploy takes a minute or two to go live."
echo
