# Portfolio site

Plain HTML/CSS/JS. No build step, no dependencies, no npm.

## Editing it

Everything on the site comes from **`js/data.js`**. That's the only file you edit.

- Add a project → copy a `{ ... }` block, change the `id`
- Fill a project in → write between the `""` quotes
- Add a log entry → new `{ ... }` at the **top** of `LOG`
- Add a demo video → new `{ ... }` in `TALKS`
- The **first** project in the list is the big "Start here" one on the home page.
  Reorder the array to change which.

## Theme

Light by default. The moon button in the nav switches to dark and remembers the
choice. Colours all live at the top of `css/style.css` — `:root` is light,
`html[data-theme="dark"]` is dark.

## Before you share the link

In each `.html` file there's an `og:image` tag near the top. Once you own a
domain, change those URLs to the full `https://...` address — that's what makes
a preview card with your photo appear when you paste the link into an email.

## Editing in the browser (easiest)

    python3 edit.py

Open http://localhost:8111 and click **✎ Edit** at the bottom-left. A panel
opens with every piece of text on the site. Type, then hit **Save** (or ctrl-S).

It writes straight into `js/data.js` — the real file, the same one Claude edits.
Your previous version is kept as `js/data.js.bak` every time you save.

The panel also has **+ new log**, **+ new award** and **+ new talk** buttons,
which add a fresh blank entry in the right place.

The Edit button only ever appears on localhost with `edit.py` running. On
GitHub Pages it does not exist, so visitors never see it.

## Seeing it without editing

Open `index.html` directly, or:

    python3 -m http.server 8111

## Checking what's left

    ./check.sh

Prints every section still blank.

## Putting it online (GitHub Pages)

1. Make a repo called `callum.github.io` (or any name)
2. `git init && git add -A && git commit -m "portfolio" && git push`
3. Repo → Settings → Pages → Source: `main`, folder `/ (root)`

Live in about a minute.
