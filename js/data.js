/* ============================================================
   data.js  —  THIS IS THE FILE YOU EDIT.
   Everything on the site is generated from what's in here.
   You should never need to touch the HTML files.

   To add a project:  copy one { ... } block, change the id.
   To fill one in:    write prose between the "" quotes.
   To check progress: run  ./check.sh
   ============================================================ */

/* ============================================================
   IMPACT  —  why the work matters, and who it reached.
   Only put things here you can point at. A number you cannot
   back up is worse than no number — the AIRES judges liked you
   precisely because your figures were real.
   ============================================================ */

const IMPACT = {
  /* the heading above these tiles — rename it to whatever fits */
  heading: "Recognition",

  /* one or two sentences. the thread running through your projects. */
  statement: "",

  items: [
    { big: "1st",  label: "AIRES competition",
      note: "Won with a team of three — a designer, a researcher and me as the coder." },

    { big: "",     label: "",
      note: "" }
  ]
};

/* ============================================================
   CATEGORIES  —  the three groups on the home page, in order.
   A project with category: "" is hidden from the home page but
   its own page still works. Reorder these to reorder the site.
   ============================================================ */

const CATEGORIES = [
  { id: "humanoids", name: "Humanoids & arms",      blurb: "" },
  { id: "consumer",  name: "Consumer electronics",  blurb: "" },
  { id: "more",      name: "More projects",         blurb: "" },
  { id: "talks",     name: "Presentations",         blurb: "" }
];


const PROJECTS = [
  {
    id:      "impact",
    category: "more",
    size:     "medium",   // large | medium | small — how much room it gets
    name:    "Impact",
    tagline: "A Breakout-style game on a single 8x8 LED grid, with a knob for the paddle.",
    tags:    ["arduino", "game", "electronics"],
    status:  "built",
    started: "2024-10",
    repo:    "",
    demo:    "",
    image:   "img/impact-lit.jpg",
    photos:  [
      ["img/impact-lit.jpg", ""],
      ["img/impact-close.jpg", ""],
      ["img/g_impact_DSC_2113.jpg", ""],
      ["img/g_impact_phone1.jpg", ""]
    ],

    goal:      "I wanted to build an actual arcade game out of parts rather than write one on a screen — something with a real knob you turn and a real button you press. [? where did the name Impact come from?]",
    firstTry:  "One 8x8 MAX7219 LED matrix for the screen, driven with the LedControl library. A potentiometer on A0 moves the paddle, a button launches the ball, and there is an RGB LED next to it for status.\n\nThe ball has an x and a y direction and flips one of them whenever it hits a wall. You get three lives.",
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "No room for a score",
        what:  "An 8x8 grid is 64 pixels for the paddle, the ball and everything else, so there is no space left to show how many lives you have.",
        why:   "",
        fix:   "I used the RGB LED as the lives counter instead of trying to fit a score onto the grid, since there is no room for numbers on 8x8. It goes green for three lives, blue for two and cyan for one, so you can read how you are doing without taking a pixel off the playfield."
      },
      {
        title: "[? the hardest bug — give it a short title]",
        what:  "[? this one is yours. An 8x8 grid is 64 pixels for a paddle, a ball and the score all at once — what was the hardest part to get working? A guess at the kind of thing: the ball moving too fast to follow, or the paddle feeling jumpy because a potentiometer never sits still.]",
        why:   "",
        fix:   "I also rewrote the whole thing four days after the first version. [? what did the second version change?]"
      }
    ],
    nowDoes:   "It plays. You turn the knob to move the paddle, press the button to launch, and the ball bounces off the left, right and top walls. Miss it and you lose a life, and the RGB LED changes colour.",
    next:      "[? would you add bricks, a score, more levels — or leave it?]"
  },

  {
    id:      "science-in-the-park",
    category: "talks",
    size:     "medium",   // large | medium | small — how much room it gets
    name:    "Science in the Park 2026",
    tagline: "I took MEATBALL to Science in the Park and demoed it to the public.",
    tags:    ["outreach", "robotics", "public demo"],
    status:  "built",
    started: "2026-10",
    repo:    "",
    demo:    "",
    image:   "img/meatball-fair-demo.jpg",
    photos:  [
      ["img/meatball-fair-demo.jpg",  "Explaining MEATBALL at the booth"],
      ["img/meatball-fair-booth.jpg", "At the stand"]
    ],

    goal:      "[? why did you want to show MEATBALL in public rather than just build it?]",
    firstTry:  "[? what did you prepare beforehand — a demo, a script, something for people to try?]",
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "[? what didn't go to plan on the day — short title]",
        what:  "[? what did not go to plan on the day? a crash, a flat battery, a question you could not answer?]",
        why:   "",
        fix:   "[? what did you do differently as the day went on, once you had explained it a few times?]"
      }
    ],
    nowDoes:   "[? what actually happened — roughly how many people stopped, what did they ask, what surprised them?]",
    next:      "[? would you do another one? what would you bring?]"
  },


  {
    id:      "meatball",
    category: "humanoids",
    size:     "large",   // large | medium | small — how much room it gets
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
      ["img/meatball-gripper.jpg", "Gripper"]
    ],

    goal:      "I wanted to build a full-sized humanoid with two arms that could actually pick things up and do chores. The reason why I wanted to build my own is that humanoid robots are very expensive and hard to build.",
    firstTry:  "I tried designing my own arm but I soon realised that I could just steal other people's designs. The design I chose to steal was the SO-101 robotic arm.",
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "The serial ports kept swapping",
        what:  "The serial ports renumber every time you unplug something, so ACM0 and ACM1 swap and any port I had written down was wrong.",
        why:   "",
        fix:   "I stopped hard coding anything and look the ports up every time instead."
      },
      {
        title: "I couldn't tell the cameras apart",
        what:  "Both wrist cameras report the exact same device name, so there is no way to tell them apart from a list. Some of the video devices open perfectly fine and then never send a single frame, because they are not cameras at all.",
        why:   "",
        fix:   "I wrote a script that takes a snapshot from every camera so I can see which one is which. I also worked out the real limit is USB bandwidth, not power, because two raw 640x480 streams at 30fps are about 147 Mbps each."
      },
      {
        title: "The shoulder was slowly cooking itself",
        what:  "If you hold the arm out at mid range that is where gravity pulls hardest, so the servo is fighting the most there. It does not fail straight away, it just slowly cooks itself while everything looks fine.",
        why:   "",
        fix:   "I built a safety layer that everything has to go through. It watches for jams, overheating and slow cooking, it clamps every command so it can never hit the end stop, and it moves around the resting pose instead of mid range so the shoulder is not holding up the whole arm."
      }
    ],
    nowDoes:   "It is built and standing. Both arms work, six joints each, and I can pose them by hand and play it back. It has a printed head with a face I painted. The safety stack runs on everything.",
    next:      "I am training LeRobot and SmolVLA policies so the arms learn tasks instead of replaying what I recorded. [? what do you want it to actually do once that works?]"
  },

  {
    id:      "breadboard-robot",
    category: "humanoids",
    size:     "medium",   // large | medium | small — how much room it gets
    name:    "Breadboard Robot",
    tagline: "A two-foot bipedal robot I am designing, meant to walk and jump on a low budget.",
    tags:    ["robotics", "actuators", "esp32", "cad"],
    status:  "in progress",
    started: "2026-08",
    repo:    "",
    demo:    "",
    image:   "img/breadboard-leg.jpg",
    photos:  [
      ["img/breadboard-leg.jpg", "Leg V2, rendered from the CAD"]
    ],

    goal:      "The main purpose of the Breadboard Robot was to figure out how to make bipedal robots at a low cost.",
    firstTry:  "I designed a leg in CAD first, rather than buying parts and hoping they fit. The first assembly had the thigh, a motor mount and a motor holder as separate printable pieces, and I revised the whole thing into a V2 the next day. [? what was wrong with V1?]",
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "[? what has gone wrong so far — short title]",
        what:  "[? this one is yours — what has actually gone wrong so far? even on a project still in CAD there is usually something: a part that would not print, a joint that could not take the torque, a motor that turned out too weak or too expensive.]",
        why:   "",
        fix:   "[? what did V2 of the leg change, and why?]"
      }
    ],
    nowDoes:   "It is still at the design stage. The leg assembly is drawn and revised to V2, and I have worked out the actuators: RobStride RS00 quasi-direct-drive joint modules, 5 N·m rated and 14 N·m peak, 310 g each, about 85 dollars. Eight of them, driven over CAN from an ESP32. No hobby servos — they have no real position feedback and would not hold a leg up.",
    next:      "[? what is the next physical step — print the leg, order one actuator and test it, something else?]"
  },

  {
    id:      "geedo",                     // used in the URL: project.html?id=geedo
    category: "consumer",
    size:     "large",   // large | medium | small — how much room it gets
    featured: true,
    name:    "Geedo",
    tagline: "Geedo is a more affordable way to get personal assistance and companionship. It runs on a circuit board (PCB) I designed myself.",                          // one line. what it is, in plain words.
    tags:    ["hardware", "pcb design", "firmware", "python"],
    status:  "in progress",               // built | in progress | shelved
    started: "2026-05",                   // first commit: 19 May 2026
    repo:    "NA",                          // github link, or leave ""
    demo:    "NA",                          // video link, or leave ""
    image:   "img/geedo-face.jpg",        // the one used on the card + at the top of the page
    photos:  [
      ["img/geedo-face.jpg", ""],
      ["img/geedo-open.jpg", "Inside: the PCB I designed"],
      ["img/geedo-hand.jpg", "My PCB, with the battery fitted"],
      ["img/g_geedo_DSC_2126.jpg", ""],
      ["img/g_geedo_DSC_2129.jpg", ""],
      ["img/g_geedo_DSC_2131.jpg", ""],
      ["img/g_geedo_DSC_2135.jpg", ""],
      ["img/g_geedo_DSC_2138.jpg", ""]
    ],

    /* --- the six headings. this is the actual writing. --- */
    goal:      "I was trying to develop Geedo, an affordable consumer pet robot designed to transition from a personal DIY project into a commercial product.",   // 1. What I was trying to do
    firstTry:  "I tried making a prototype of it with consumer off-the-shelf parts, but I realised that if I wanted to make this a product I would have to make custom parts.",   // 2. What I tried first
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "The first PCB didn't work",
        what:  "The first thing that wasted money was the first version of my PCB design, which had missing traces, and I did not account for the fact that there were some parts I could not solder.",
        why:   "",
        fix:   "I spent weeks refining and testing the new design of my PCB to not only work but also have a buzzer, more stable power, and more."
      }
    ],
    nowDoes:   "It now works, and so far the only flaw I have found is the USB-C one below.",   // 5. What it does now
    next:      "I would fix the issue where, if you plug USB-C in without the battery, the board gets stuck in a reboot loop and can only be turned on with a battery."    // 6. What I would do next
  },

  {
    id:      "led-mask",
    category: "more",
    size:     "medium",   // large | medium | small — how much room it gets
    name:    "LED Mask",
    tagline: "My first LED mask, built on four chained dot-matrix modules.",
    tags:    ["leds", "esp32", "wearable", "animation"],
    status:  "built",
    started: "2025-10",
    repo:    "",
    demo:    "",
    image:   "img/ledmask1-face.jpg",
    photos:  [
      ["img/ledmask1-face.jpg", ""],
      ["img/g_ledmask1_DSC_2097.jpg", ""],
      ["img/g_ledmask1_worn3.jpg", ""],
      ["img/g_ledmask1_worn4.jpg", ""]
    ],

    goal:      "I wanted a Halloween costume with a face that moved instead of a fixed mask. [? what gave you the idea?]",
    firstTry:  "I chained four MAX7219 8x8 dot-matrix modules together to make one 32x8 display, driven off an Arduino with the LedControl library. Monochrome red, one colour, no brightness per pixel beyond the module's global setting.",
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "The pixels came out in the wrong place",
        what:  "Chained matrix modules do not map to coordinates the way you expect. Depending on how the modules are oriented and wired, your x and y can come out mirrored or upside down, and nothing in the code tells you which. [? how did you first notice it was wrong?]",
        why:   "",
        fix:   "I wrote a throwaway sketch whose whole job was to light one single LED at a chosen x and y, with REVERSE_X and REVERSE_Y flags I could flip until the right pixel came on. Once I knew the mapping, everything else could be drawn in normal coordinates.\n\nThen I built the animation sketch on top of that: a frame every 40ms for about 25fps, switching animation every five seconds, running at brightness 1 out of 15 because it is going on a face."
      }
    ],
    nowDoes:   "It runs animations on a 32x8 red dot-matrix panel at around 25 frames a second, cycling automatically. [? did you actually wear it?]",
    next:      "I rebuilt it the next year as LED Mask v2, on a full-colour addressable panel instead of monochrome modules."
  },

  {
    id:      "void",
    category: "more",
    size:     "large",   // large | medium | small — how much room it gets
    name:    "VOID",
    tagline: "A handheld games console I built that prevents my friends from becoming bored.",
    tags:    ["esp32", "arduino", "embedded", "game dev"],
    status:  "built",
    started: "2026-01",
    repo:    "",
    demo:    "",
    image:   "img/void-front.jpg",
    photos:  [
      ["img/void-front.jpg", ""],
      ["img/void-scale.jpg", ""],
      ["img/void-shell.jpg", ""],
      ["img/g_void_DSC_2102.jpg", ""]
    ],

    goal:      "I wanted a handheld console I could load lots of different games onto from a menu, like a modern Game Boy. I originally built this project because I was talking to my friend one day and he said he was quite bored when he was at a restaurant or an airport. Then my brain immediately popped to the thought that I could build a game console!",
    firstTry:  "The first version was a single sketch with the menu and three games all compiled into it: ZombieNights, TowerDefense and StickmanQuest. I wanted more games, so I tried to add a few more, but I soon stumbled upon a major issue. The ESP32 that I was using did not have enough storage to store all the games. After realizing this I added a SD card holder and connected it to the ESP32. After adding the SD card the games ran smoothly and after looking at how many games it could store, I was astounded, it could hold up to 8000 games.",
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "The ESP32 ran out of room",
        what:  "An ESP32 only runs one program. Everything has to be compiled into one binary, and the flash fills up fast, so a menu that just calls into a few built-in games does not scale past a handful.",
        why:   "",
        fix:   "I stopped treating the firmware as fixed and started treating it as data.\n\nEvery game now compiles to its own .bin file that lives on the SD card in a /games folder. The launcher reads the card, lists whatever .bin files it finds, and when you pick one it uses Update.begin with U_FLASH to overwrite the ESP32's own program with that game's binary, then calls ESP.restart. The console boots straight into the game. To get back, every game includes a header I wrote called VOID_Return.h, which checks the button the instant it boots and, if you are holding it, reads launcher.bin back off the SD card and reflashes to the launcher.\n\nI made the header deliberately easy to bolt on: copy one file into the game's folder, add one #include, and call voidReturnCheck() as the first line of setup(). The game's own code never has to change. There's also an _ADD_NEW_GAMES_HERE folder with the header and instructions already in it, so adding a game later is copy-paste."
      },
      {
        title: "I lost games to a filename mix-up",
        what:  "The second thing was my own fault. While building the first batch of games I saved each one as a file called CODE inside its own folder, so the folder was the name and the file wasn't. That was fine on my computer. The moment I uploaded them somewhere that only looks at filenames, they all collided and overwrote each other, and I lost games that way. I had two files called CODE and code, plus ones called 404, FPS and RACING with no extension at all.",
        why:   "",
        fix:   "I renamed every file to something unique, and the README now says to rename a game before uploading it anywhere."
      }
    ],
    nowDoes:   "There are 13 games on it plus the launcher: Forest Survivor, Cyber Void FPS, Soccer Championship, Tower Defense, Tower Defense 3D, Beach Resort, Kart Racing, Space Station, Project 404, Stickman Clash, Stickman Arena 3D, Pilfering Pirates and Nuke Wars. Several of them are 3D, running on a microcontroller.\n\nThe hardware is an ESP32-S3 with an ILI9341 screen, a joystick, one button and an SD card module. You pick a game from the menu, it flashes and boots in a few seconds, and holding the button while it restarts takes you back to the menu.",
    next:      "[? what would you add next — more games, better hardware, a case?]"
  },

  {
    id:      "led-mask-v2",
    category: "more",
    size:     "medium",   // large | medium | small — how much room it gets
    name:    "LED Mask v2",
    tagline: "An LED mask I made for Halloween, with a face that animates across 256 LEDs.",
    tags:    ["leds", "esp32", "wearable"],
    status:  "built",
    started: "2026-10",
    repo:    "",
    demo:    "",
    image:   "img/ledmask2-lit.jpg",
    photos:  [
      ["img/ledmask2-lit.jpg", ""],
      ["img/ledmask2-colour.jpg", ""],
      ["img/ledmask2-back.jpg", ""],
      ["img/g_ledmask2_DSC_2084.jpg", ""],
      ["img/g_ledmask2_DSC_2091.jpg", ""],
      ["img/g_ledmask2_DSC_2093.jpg", ""],
      ["img/g_ledmask2_DSC_2096.jpg", ""],
      ["img/g_ledmask2_worn2.jpg", ""]
    ],

    goal:      "I wanted to redo my LED mask properly. The first one was four monochrome dot-matrix modules; this time I wanted full colour, real animations, and a face that reacts. [? what specifically bugged you about v1?]",
    firstTry:  "Before touching any hardware I built a simulator that runs in a browser, so I could design animations on my laptop and see them straight away instead of reflashing a board every time I changed a pixel.\n\nThen I started on real hardware with an ESP32, and wrote small sketches first: one to check the panel lit up at all, one to check the colours were in the order I thought, and one to get a face on it.",
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "The panel kept freezing",
        what:  "I moved the project onto a spare ESP8266 and the panel started freezing mid-animation. It turned out FastLED has to write the whole frame to the LEDs in one uninterrupted go, and on an ESP8266 the WiFi stack interrupts it, so frames get dropped and the panel locks up. [? how long did that take to work out?]",
        why:   "",
        fix:   "For the freezing, I set FASTLED_ALLOW_INTERRUPTS to 0 so nothing can interrupt a frame while it is being written."
      },
      {
        title: "It kept cutting out once I wore it",
        what:  "The other problem was physical. It ran fine on jumper wires on the bench and kept cutting out once it was on the mask, because a costume gets moved around and jumper wires do not stay put.",
        why:   "",
        fix:   "For the wiring, I soldered it instead of using jumpers, and powered the board from the panel's own 5V through VIN rather than running a second supply."
      }
    ],
    nowDoes:   "It runs about fifteen animations on a 256-LED panel: a cartoon face, a glitchy version of it, eyes in the dark, haunted static, VHS tracking, SYSTEM ERROR, no signal, blood, candles, a storm, a night sky and some scrolling text.\n\nOne button cycles to the next animation and the other pokes the face, which makes it react. It runs off a USB power bank, and I designed the mount for it in OpenSCAD.\n\nThe firmware is written so the same code runs on an Arduino Mega, an ESP32 or an ESP8266 without changing anything except which pins it uses — so I could test on whatever board was on the desk. Every animation is a setup() and a step() with the same names as the simulator, so anything I design in the browser ports straight over.",
    next:      "[? what would you change for next Halloween?]"
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
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "Making it faster made it worse",
        what:  "Render puts free servers to sleep, so the first load took about 50 seconds. I fixed that by adding a GitHub Action that pinged my own server every 5 minutes to keep it awake. That is probably what got the service suspended. I had made it worse by trying to make it faster.",
        why:   "",
        fix:   "I turned the pinger off."
      },
      {
        title: "The database quietly stopped working",
        what:  "The database broke too. psycopg2 would not import on Python 3.13 on Render, so the driver failed and the whole app quietly fell back to saving everything in a data.json file. It looked like it was working and it was not.",
        why:   "",
        fix:   "I pinned psycopg2 to 2.9.10 so it uses a prebuilt wheel and actually imports on 3.13."
      }
    ],
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
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "The AI was too slow for the game",
        what:  "The AI is slow. One call takes one to three seconds, and Among Us does not wait for you. If I asked it what to do every frame the game froze, and if I waited for an answer before moving, the bot just stood still and got killed.",
        why:   "",
        fix:   "I split it in two. Sensing runs every tick and is cheap, it just updates what the bot remembers and writes a short text report of what is happening. Thinking runs about every 3 seconds in the background and only sets a high level goal. So the bot keeps moving smoothly while the slow part catches up."
      }
    ],
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
    /* --- problems: as many as it had. what happened, why, how I fixed it. --- */
    problems: [
      {
        title: "Everything scored the same",
        what:  "Throwing the creatures straight onto hard ground meant they all failed about equally, so there was nothing for evolution to pick between.",
        why:   "",
        fix:   "I added a curriculum, so the terrain starts easy and gets harder as the population gets better. Throwing them straight onto hard ground meant everything scored about the same and there was nothing to select for."
      },
      {
        title: "[? the stupid shortcut evolution found]",
        what:  "[? this is the important one — what did the creatures do that you did not expect? evolution almost always finds a stupid shortcut instead of actually learning. what was yours?]",
        why:   "",
        fix:   ""
      }
    ],
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
  email:    "",
  github:   "https://github.com/Breadboardy",
  linkedin: "",
  youtube:  "https://www.youtube.com/channel/UCbOmJHALy3TuAudZlwAlPdQ/",
  url:      ""          // your domain once you have one, e.g. "https://callum.dev"
};
