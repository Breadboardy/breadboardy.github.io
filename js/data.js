/* ============================================================
   data.js  —  THIS IS THE FILE YOU EDIT.
   Everything on the site is generated from what's in here.
   You should never need to touch the HTML files.

   To add a project:  copy one { ... } block, change the id.
   To fill one in:    write prose between the "" quotes.
   To check progress: run  ./check.sh
   ============================================================ */

/* ============================================================
   CATEGORIES  —  the three groups on the home page, in order.
   A project with category: "" is hidden from the home page but
   its own page still works. Reorder these to reorder the site.
   ============================================================ */

const CATEGORIES = [
  { id: "humanoids", name: "Humanoids & arms",      blurb: "" },
  { id: "consumer",  name: "Consumer electronics",  blurb: "" },
  { id: "more",      name: "More projects",         blurb: "" }
];


const PROJECTS = [

  {
    id:      "meatball",
    category: "humanoids",
    featured: true,
    name:    "MEATBALL",
    tagline: "A humanoid robot meant to make humanoid robots more accessible and cheaper.",
    tags:    ["robotics", "3d printing", "python", "servos", "computer vision"],
    status:  "built",
    started: "2026-05",                   // first commit: 29 May 2026
    repo:    "",
    demo:    "",
    image:   "img/meatball-front.jpg",
    photos:  [
      ["img/meatball-front.jpg",   "Head on"],
      ["img/meatball-face.jpg",    "The painted face"],
      ["img/meatball-arms.jpg",    "Both arms"],
      ["img/meatball-gripper.jpg", "Gripper"],
      ["img/meatball-fair-demo.jpg",  "Demoing at the science fair"],
      ["img/meatball-fair-booth.jpg", "At the booth"]
    ],

    goal:      "I wanted to build a full sized humanoid with two arms that could actually pick things up and do chores. The reason why I wanted to build my own is that humanoid robots are very expensive and hard to build.",
    firstTry:  "I tried designing my own arm but I soon realize that i could just steal other peoples designs. The design I chose to steal is the SO-101 robotic arm.",
    wentWrong: "Almost nothing about the hardware stayed still.\n\nThe serial ports renumber every time you unplug something, so ACM0 and ACM1 swap and any port I had written down was wrong. Both wrist cameras report the exact same device name, so there is no way to tell them apart from a list. Some of the video devices open perfectly fine and then never send a single frame, because they are not cameras at all.\n\nThe worst one was the shoulder. If you hold the arm out at mid range that is where gravity pulls hardest, so the servo is fighting the most there. It does not fail straight away, it just slowly cooks itself while everything looks fine.",
    changed:   "I stopped hard coding anything. I wrote a script that takes a snapshot from every camera so I can see which one is which. I worked out the real limit is USB bandwidth, not power, because two raw 640x480 streams at 30fps are about 147 Mbps each.\n\nThen I built a safety layer that everything has to go through. It watches for jams, overheating and slow cooking, it clamps every command so it can never hit the end stop, and it moves around the resting pose instead of mid range so the shoulder is not holding up the whole arm.",
    nowDoes:   "It is built and standing. Both arms work, six joints each, and I can pose them by hand and play it back. It has a printed head with a face I painted. The safety stack runs on everything.",
    next:      "I am training LeRobot and SmolVLA policies so the arms learn tasks instead of replaying what I recorded. [? what do you want it to actually do once that works?]"
  },

  {
    id:      "breadboard-robot",
    category: "humanoids",
    name:    "Breadboard Robot",
    tagline: "The Breadboard Robot is a simple full body humanoid.",
    tags:    ["robotics", "actuators", "esp32", "cad"],
    status:  "in progress",
    started: "2026-08",
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "The main purpose of the Breadboard robot was to figure out how to make bipedal robots at a low cost.",
    firstTry:  "",
    wentWrong: "",
    changed:   "",
    nowDoes:   "",
    next:      ""
  },

  {
    id:      "geedo",                     // used in the URL: project.html?id=geedo
    category: "consumer",
    featured: true,
    name:    "Geedo",
    tagline: "Geedo is a more affordable way to get personal assistance and companionship. ",                          // one line. what it is, in plain words.
    tags:    ["hardware", "pcb design", "firmware", "python"],
    status:  "in progress",               // built | in progress | shelved
    started: "2026-05",                   // first commit: 19 May 2026
    repo:    "NA",                          // github link, or leave ""
    demo:    "NA",                          // video link, or leave ""
    image:   "img/geedo-face.jpg",        // the one used on the card + at the top of the page
    photos:  [                            // more photos, shown as a strip. caption each one.
      ["img/geedo-face.jpg",   "Screen on"],
      ["img/geedo-front.jpg",  "The printed case"],
      ["img/geedo-inside.jpg", "Board and battery"]
    ],

    /* --- the six headings. this is the actual writing. --- */
    goal:      "I was trying to develop Geedo, an affordable consumer pet robot designed to transition from a personal DIY project into a commercial product.",   // 1. What I was trying to do
    firstTry:  "I tried making a prototype of it with consumer off the shelf parts, but I realized that if I wanted to make this a product i would have to make custom parts.",   // 2. What I tried first
    wentWrong: "The first thing that wasted money was the first version of my PCB design, which had missing traces and I did not account that some parts I could not solder.",   // 3. What went wrong      <-- the important one. don't tidy it.
    changed:   "I spent weeks refining and testing the new design of my PCB to not only work but also have a buzzer, more stable power, and more.",   // 4. What I changed
    nowDoes:   "It now works perfectly and so far i have not found any flaws with it.",   // 5. What it does now
    next:      "I would fix that the issue that when you plug a USB-c in without  the battery the board is stuck in a reboot loop and can only be turned on with a battery."    // 6. What I would do next
  },

  {
    id:      "led-mask",
    category: "more",
    name:    "LED Mask",
    tagline: "",
    tags:    ["leds", "esp32", "wearable", "animation"],
    status:  "built",
    started: "2026-10",
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "",
    firstTry:  "",
    wentWrong: "",
    changed:   "",
    nowDoes:   "",
    next:      ""
  },

  {
    id:      "void",
    category: "more",
    name:    "VOID",
    tagline: "A handheld games console I built on an ESP32, with three games on it.",
    tags:    ["esp32", "arduino", "embedded", "game dev"],
    status:  "built",
    started: "2026-01",
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "[? what made you build a console instead of just one game?] I wanted a handheld I could load different games onto from a menu, like a tiny Game Boy.",
    firstTry:  "[? what was the first version like, and what did it run on?]",
    wentWrong: "Redrawing the whole screen every frame was too slow. [? what did that actually look like when you ran it — flickering, lag, something else?]",
    changed:   "In ZombieNights I switched to dirty rectangles, which means only redrawing the parts of the screen that actually changed instead of all of it. Most of the screen is the same from one frame to the next, so there is no point drawing it again.",
    nowDoes:   "There is a menu you boot into and three games: ZombieNights, TowerDefense and StickmanQuest. They are separate Arduino sketches and the menu loads them.",
    next:      "[? more games, or better hardware?]"
  },

  {
    id:      "led-mask-v2",
    category: "more",
    name:    "LED Mask v2",
    tagline: "",
    tags:    ["leds", "esp32", "wearable"],
    status:  "in progress",
    started: "2026-10",
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "",
    firstTry:  "",
    wentWrong: "",
    changed:   "",
    nowDoes:   "",
    next:      ""
  },

  {
    id:      "furwell",
    category: "",
    name:    "Furwell",
    tagline: "An AI vet app. You describe what is wrong with your pet and it gives you a health report.",
    tags:    ["python", "openai api", "postgres", "stripe", "web app"],
    status:  "built",
    started: "2026-07",                   // first commit: 15 July 2026
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "This was my project for the AIRES competition. [? what was the actual brief — what were you asked to build?] I was the coder on a team of three, with one designer and one researcher. My job was to turn what they gave me into something that actually ran.",
    firstTry:  "I started with the basics: a Python server that sends the symptoms you type to OpenAI, and gets back a report saying what the condition probably is. Then accounts so you could save your pet. [? what did the designer hand you, and did you build to their design from the start or change it?]",
    wentWrong: "Render puts free servers to sleep, so the first load took about 50 seconds. I fixed that by adding a GitHub Action that pinged my own server every 5 minutes to keep it awake. That is probably what got the service suspended. I had made it worse by trying to make it faster.\n\nThe database broke too. psycopg2 would not import on Python 3.13 on Render, so the driver failed and the whole app quietly fell back to saving everything in a data.json file. It looked like it was working and it was not.",
    changed:   "I turned the pinger off. I pinned psycopg2 to 2.9.10 so it uses a prebuilt wheel and actually imports on 3.13. I also wrote my own rule based moderation for the community posts instead of using a moderation API, because the paid ones cost money.",
    nowDoes:   "It runs on Render with a Postgres database. You make an account, add your pet, and describe symptoms or upload a photo. It gives you a report with the likely condition, the causes, and a month of meals and exercise. There is a clinic map, a community feed where people post photos and comment, an admin page only I can see, and a paid tier at $7.99 a month. Free accounts get 10 AI checks a day.",
    next:      "[? what would you fix first if you went back to it?] The whole thing was built in one week for the competition, so there is a lot I would tidy up."
  },

  {
    id:      "amongus-ai",
    category: "",
    name:    "Among Us AI",
    tagline: "A mod that lets an AI actually play Among Us, in the real game.",
    tags:    ["c#", "bepinex", "llm agents", "reverse engineering"],
    status:  "built",
    started: "2026-07",
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "I wanted to see if an LLM could really play Among Us, not just talk about it. It had to walk around, do tasks, and lie in meetings like a person would.",
    firstTry:  "Most people do this with screen capture, where the AI looks at a picture of the screen. I read the game's live object state instead, using BepInEx and Reactor. That means I get the actual player positions, tasks, bodies and vents as data, so it is never guessing what it is looking at.",
    wentWrong: "The AI is slow. One call takes one to three seconds, and Among Us does not wait for you. If I asked it what to do every frame the game froze, and if I waited for an answer before moving, the bot just stood still and got killed.",
    changed:   "I split it in two. Sensing runs every tick and is cheap, it just updates what the bot remembers and writes a short text report of what is happening. Thinking runs about every 3 seconds in the background and only sets a high level goal. So the bot keeps moving smoothly while the slow part catches up.",
    nowDoes:   "It plays. It walks, does tasks, reports bodies, vents and kills, and keeps a memory log of what it saw and when. In meetings it types in chat and votes. [? what happened the first time it played with real people?]",
    next:      "[? what does it still get obviously wrong?] I only run it in private lobbies with friends, because mods are against the game's terms even in private games."
  },

  {
    id:      "stickman-evolution",
    category: "",
    name:    "Stickman Evolution",
    tagline: "Stick figures that teach themselves to walk, by evolution instead of training.",
    tags:    ["python", "genetic algorithms", "neural networks", "numpy"],
    status:  "built",
    started: "2026-05",
    repo:    "",
    demo:    "",
    image:   "",

    goal:      "I wanted creatures that learn to move on their own, without me animating anything or telling them how to walk.",
    firstTry:  "Each creature has a small neural network for a brain. I made a population of them with random weights, let them all try to move, kept the ones that got furthest, and mixed those together to make the next generation. No machine learning library, just numpy and a Brain class I wrote.",
    wentWrong: "[? this is the important one — what did the creatures do that you did not expect? evolution almost always finds a stupid shortcut instead of actually learning. what was yours?]",
    changed:   "I added a curriculum, so the terrain starts easy and gets harder as the population gets better. Throwing them straight onto hard ground meant everything scored about the same and there was nothing to select for.",
    nowDoes:   "It evolves creatures that learn to move over terrain that gets harder. I reused the same engine for a lot of things: a quadruped, a frog, a squid, microgravity, a race arena, 3D terrain, and an FPS agent.",
    next:      "[? which of the variants do you actually want to take further?]"
  }

];


/* ============================================================
   BUILD LOG  —  one entry a week. 100-150 words.
   Newest goes at the TOP.
   date format: "YYYY-MM-DD"  (it gets displayed nicely)
   ============================================================ */

const LOG = [

  {
    date: "2026-09-19",
    title: "",          // short. e.g. "Got the wrist servo talking"
    body:  ""           // what you worked on, what broke, what you figured out.
  }

];


/* ============================================================
   TALKS & DEMOS  —  one 60-90 second video per project.
   Phone camera is fine. You, explaining what it does.
   Upload to YouTube (unlisted is fine) and paste the link.
   ============================================================ */

const TALKS = [

  {
    title: "",        // e.g. "MEATBALL stands up"
    project: "",      // the id of the project it goes with, e.g. "meatball"
    date: "",         // "YYYY-MM-DD"
    url: "",          // youtube link
    thumb: "",        // e.g. "img/meatball-thumb.jpg", or leave "" for a placeholder
    blurb: ""         // one or two sentences about what's in the video
  }

];


/* ============================================================
   PROFILE  —  the About page. Structured like a LinkedIn profile
   so a stranger can scan it in twenty seconds.
   ============================================================ */

const PROFILE = {
  headline: "robots & things",     // the line under your name. e.g. "Builds robots, games and tools. 13."
  location: "California",     // e.g. "London, UK"
  openTo:   ""      // e.g. "Looking for a school that lets me keep building."
};

const EDUCATION = [
  {
    what:   "Homeschooled",     // e.g. "Homeschooled"
    where:  "Hickman",     // e.g. "Hickman"
    from:   "",     // e.g. "2024"
    to:     "now",     // e.g. "now"
    detail: ""      // a line or two. what you study, how you work.
  }
];

/* Competitions, programmes, anything externally judged and dated.
   This is the section that carries the most weight — outside results
   are the only thing on the site nobody can claim you talked up. */
const AWARDS = [
  {
    title:  "AIRES — winning team",     // e.g. "AIRES — 1st place"
    org:    "AIRES",     // who ran it
    date:   "2026-07-22",     // "YYYY-MM-DD"
    url:    "",     // link to results, if there is one
    detail: "Furwell was our entry for AIRES and our team won. There were three of us: a designer, a researcher, and me as the coder.\n\nThe judges said two things stood out. The first was that our presentation used plain numbers instead of vague claims. The second was that the website actually looked good and actually worked, rather than being a mockup.\n\n[? what was the brief, who ran the competition, and what did you win? those three facts are the only things still missing from the strongest section on this site.]"      // what the problem was, what your code did, why you won
  }
];

const LANGUAGES = [
  { name: "English",  level: "Native" },   // e.g. "Native"
  { name: "Mandarin", level: "" }    // be honest here — "Intermediate, still working at it" is fine
];

/* Extra skills that aren't already a project tag. Leave empty to just
   use the tags counted off your projects. */
const EXTRA_SKILLS = [];


/* ============================================================
   ABOUT + HOME  —  your words. short.
   ============================================================ */

const SITE = {
  name:     "Callum",
  role:     "I build robots, software, and more things",         // the line under "Hi, I'm Callum." e.g. "I build robots, games and tools."
  now:      "",         // one line: what you are working on THIS week. keep it current.
  intro:    "",         // 3-4 sentences for the home page. your voice, not an adult's.
  photo:    "img/callum.jpg",   // your picture. swap the file to change it.
  /* The big one. Several paragraphs — blank line between each.
     Age, homeschooled through Hickman, how you got into building,
     what you're into now, what you want from a school. Write a lot. */
  about:    "",
  email:    "callumconradtaylor@gmail.com",
  github:   "https://github.com/Breadboardy",
  linkedin: "https://www.linkedin.com/in/callum-taylor-5767b7438/",
  youtube:  "https://www.youtube.com/channel/UCbOmJHALy3TuAudZlwAlPdQ/",
  url:      ""          // your domain once you have one, e.g. "https://callum.dev"
};
