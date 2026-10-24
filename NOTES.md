# What I found in your code

Facts pulled from your own repos and commit history, so you don't have to
remember them. Keep this open next to `python3 edit.py` and turn each bullet
into a sentence in your own words.

The **what went wrong** box is the one that counts. Every project below already
has a real failure in its history — you don't need to invent anything.

---

## Furwell — the AIRES one

**Built in one week**: first commit 15 Jul 2026, last 22 Jul 2026, 45 commits.

What it actually is: a Python server talking to OpenAI `gpt-4o`, with a Neon
Postgres database, Stripe payments, and deployed on Render. A user describes
their pet's symptoms or photographs them, and gets back a triage report with a
likely condition, causes, and a month of meals and exercise.

You built: AI triage + chat, photo scan, clinic map, saved reports, accounts
with username/login, a community feed with likes and comments, rule-based
moderation, an owner-only admin dashboard, daily usage limits (10 free checks,
100 on the paid tier), and a $7.99/mo subscription.

**Three failures already in your commit log:**

- `"Pause the keep-alive pinger (likely cause of Render suspension)"` — you
  added a GitHub Action pinging the server every 5 minutes so Render's free
  tier wouldn't cold-start, and that's what appears to have got the service
  suspended. Fixing one problem caused a worse one.
- `psycopg2` wouldn't import on Python 3.13 on Render, so the database driver
  failed and the whole app silently fell back to a `data.json` file. Fixed by
  pinning 2.9.10 for prebuilt wheels.
- You wrote your own rule-based moderation because the paid moderation APIs
  cost money.

**Only you can answer these:**

1. What was the AIRES brief — what problem were you asked to solve?
2. Who ran it, when, and what exactly did you win?
3. Your teammates: one designer, one researcher, you coding. What did each of
   them actually hand you, and how did that change what you built?
4. What did the judges say? Anything they singled out?
5. A week is fast. What got cut?

---

## MEATBALL

~4'3" (1.30 m) 3D-printed humanoid on a repurposed lamp base, hand-painted
Dream face. Two mirrored side-mounted SO-101 arms, 6-DOF each, Feetech STS3215
servos. 257 commits, May–Sep 2026. Built and standing.

You have no leader arms, so teleop is kinesthetic — you pose a follower arm by
hand and it records.

**Things you learned the hard way** (these are in your own CLAUDE.md):

- Serial ports renumber on every replug — ACM0 and ACM1 swap, so nothing can
  be hard-coded.
- Both wrist cameras report the *same* device name, so no listing can tell them
  apart. You wrote `which_camera.py` to snapshot every node and identify them.
- Several `/dev/video*` nodes open fine and never stream — they're UVC metadata
  nodes, not cameras.
- The limit is USB **bandwidth**, not power: two raw 640×480×30 streams are
  ~147 Mbps each.
- Never move around mid-range shoulder — that's maximum gravity torque, which
  slow-cooks the servo. Move around the captured resting pose instead.

You built a full safety stack: jam detection, overheat, slow-cook, travel
limits, clamped commands with per-joint margins, anti-windup.

**Only you can answer:** why a humanoid at all? What did you expect to be hard
that turned out easy, and the reverse?

---

## Among Us AI

C# mod using BepInEx and Reactor. An LLM plays Among Us by reading the game's
**live object state** — player positions, tasks, bodies, vents — rather than
screen capture, which is the interesting choice.

The loop: SENSE every tick builds a text situation report; THINK every ~3s
makes an async LLM call that sets a high-level goal; the bot walks, does tasks,
reports, vents, kills, and in meetings it types in chat and votes.

You noted the Terms of Service issue yourself and kept it to private lobbies.

**Only you can answer:** why live state instead of screen capture — and what
happened the first time it played with real people?

---

## VOID

ESP32-S3 handheld console. Four Arduino sketches: a main menu plus three
complete games — ZombieNights, TowerDefense, StickmanQuest.

ZombieNights uses **dirty rectangles** — only redrawing the parts of the screen
that changed. That's a real optimisation, and it's the kind of constraint that
makes a good story: you had a slow display and had to work around it.

**Only you can answer:** what made you build a console instead of just a game?
What did the hardware refuse to do?

---

## Stickman Evolution

A genetic algorithm over neural-network weights, with a **curriculum that ramps
terrain difficulty** — creatures start on easy ground and it gets harder as
they get better.

You built a lot of variants off the same engine: quadruped, frog, squid,
microgravity, a race arena, an FPS agent, 3D terrain. All numpy, your own
`Brain` class, no ML framework.

**Only you can answer:** what did the creatures do that you didn't expect?
Evolution nearly always finds a stupid shortcut — what was yours?

---

## Still missing entirely

- **A build log entry.** Any week. 100–150 words.
- **Education** — Hickman, dates.
- **Languages** — your actual level in Mandarin, honestly.
- **Photos** for MEATBALL and VOID. Both would photograph well.
