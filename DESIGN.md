# DESIGN.md: "Ignite"

The visual system for the 3D rebuild of soniconsultancyservices.com (this repo), live at
`portfolio.soniconsultancyservices.com`. Content is 1:1 with the live site (see
`CONTENT.md`). The look was redesigned on 2026-09-27 after the user's reference,
meermohsin.me: blood red on black, a calligraphic script against a thin grotesk,
fire, and sacred-geometry line art. The reference's design language is borrowed;
none of its assets, copy or code are. Every flame, sound and line here is generated
in code, and every word is SCS's own.

It replaced "Compile" (graphite, vermilion and cyanotype, Fraunces and IBM Plex).
The underlying machinery is unchanged: one persistent WebGL canvas, anchors,
the compile shader, GSAP and Lenis. Only its skin and its signature moments changed.

---

## 1. Concept: the site ignites

SCS turns a plan into a shipped app. The site shows that happening, now as a burn
rather than a build log.

Every 3D object still has two states:

| state | what it looks like | what it stands for |
|---|---|---|
| **Source** | blood-red line art, thin, additive on black | the plan, the scope, the brief |
| **Built** | solid, lit, physically shaded material | the shipped product |

An **ember-red burn edge** moves through each object and turns line into matter
(the same compile shader, recoloured).

- **First load**: a script counter runs `000 → 100` on blood red, then the red burns
  away from the bottom and reveals the page.
- **Route change**: flames rise and cover the page. The destination's name is written
  in script on the red. Then a charred, glowing front burns upward and reveals the
  next page, while the 3D scene recompiles behind it.
- **Scroll**: the bottom bar's triad `+ DESIGN + BUILD + SHIP +` lights the word that
  matches your progress through the page.

Five motifs, used consistently:

1. **Script against grotesk**: every `<em>` in a heading is set in Ruthie, in red.
   It is the one warm, hand-made voice against thin Stack Sans.
2. **The plus mark**: the separator in the nav and bottom bar, the section-label
   glyph, the secondary-button ornament, the form corner marks and the ring's centre.
3. **Fire**: the loader, the route transition, the primary-button hover, embers.
4. **Sigil**: sacred-geometry hairlines in blood red (corner diagonals, a crosshair,
   a square, a diamond). Behind every page hero, the home services chapter and the CTA.
5. **Exploded view**: unchanged. The phone comes apart into Interface, Logic and
   Intelligence to explain the services on the homepage.

What we deliberately avoid: glass cards, purple/blue "AI" glows, drop shadows on
content, copying the reference's images, GIFs, audio or phrases.

---

## 2. Colour

Two themes. **Ember** (dark) is the default and the design's intent. **Bone** (light)
is available from the theme toggle. All colours are CSS custom properties
(`src/styles/tokens.css`); the 3D scenes read matching values from `src/three/palette.ts`.

The reference uses `#900` for small red text, which is only 2.3:1 on black. Here
blood red is a **surface colour only**. Red text uses brighter reds that pass AA.

### Ember (default)
| token | hex | use | contrast on bg |
|---|---|---|---|
| `--bg` | `#050303` | near-black page | — |
| `--bg-raise` | `#100A0A` | raised strips, inputs | — |
| `--bg-sunk` | `#000000` | footer | — |
| `--fg` | `#F3EEEE` | primary text | 17.9 |
| `--fg-2` | `#BDB2B2` | secondary text | 10.0 |
| `--fg-3` | `#948888` | tertiary / captions | 6.0 (5.7 on raise) |
| `--signal` | `#F0252B` | small red text, links, focus, rules | ≥4.5 |
| `--script` | `#D60407` | large script words (AA large, ≥3:1) | 3.8 |
| `--blood` | `#990000` | fills: buttons, loader, sigil, signature | surface only |
| `--on-signal` | `#FFFFFF` | text on blood buttons | 8.9 on blood |
| `--bone` | `#E4D6C3` | secondary accent: "live" chips, ok states | 14.4 |

### Bone (light)
| token | hex | contrast on bg |
|---|---|---|
| `--bg` | `#EFE8DF` | — |
| `--fg` | `#160808` | 16.1 |
| `--fg-2` | `#4A3A3A` | 8.8 |
| `--fg-3` | `#665656` | 5.7 |
| `--signal` / `--script` / `--blood` | `#990000` | 7.3 |
| `--bone` | `#5C4A38` | 6.9 |

Rules:
- Blood red never carries small text. Use `--signal` for red text under 24px.
- Product tints (`content/work.ts`, sampled from each product's own UI) are pulled
  60% toward blood red wherever they render, so each product keeps a trace of its
  identity without breaking the palette.
- Gradients appear only in fire (loader, transition, button hover) and 3D lighting.

---

## 3. Type

| role | family | notes |
|---|---|---|
| **Display** | **Stack Sans Headline** (variable `wght` 200–700) | Thin (200–250) for headlines, tight tracking (`-0.03em`). Same family the reference uses. |
| **Body** | **Stack Sans Text** (variable `wght` 200–700) | The text cut of the same family, at 330, for long case-study prose. The reference has no long copy; this site does. |
| **Script** | **Ruthie** | Emphasis words (`<em>` in headings), stat numerals, the loader counter, the transition label, the wordmark and the footer signature. Scaled by `--script-scale` (1.32) because its x-height is small. |
| **Shout** | **Bebas Neue** | The technology marquee only. |
| **Labels** | Stack Sans Headline 400, uppercase, `+0.16em` | Nav, section labels, chips, buttons, data. |

All four are SIL OFL from Google Fonts, self-hosted as woff2 in `public/fonts/`
(latin + latin-ext, split by `unicode-range`). There are no font CDNs; the live CSP
is `font-src 'self'`. Total font weight is about 144 KB, down from about 395 KB.

Script words overshoot their line box. `.line-mask:has(em)` gives them extra room
inside the reveal clip, and gives it back with negative margins.

Fluid scale (`clamp`, 360 → 1600px viewport):

| token | size | line-height | weight |
|---|---|---|---|
| `display-xl` | 3rem → 9rem | .94 | 200 |
| `display` | 2.5rem → 6.2rem | .98 | 220 |
| `h2` | 2rem → 4.2rem | 1.04 | 250 |
| `h3` | 1.3rem → 1.8rem | 1.18 | 380 |
| `lead` | 1.08rem → 1.3rem | 1.52 | 330 |
| `body` | 1rem | 1.64 | 330 |
| `label` | .74rem, uppercase, `+.16em` | 1.3 | 400 |

Note for testing: on Linux (FreeType), light weights look heavier at small sizes
because of hinting. At display sizes the axis interpolates correctly.

---

## 4. Space and grid

- Base unit **4px**. 12-column grid, max content width 1440px. Gutter
  `clamp(16px, 2.2vw, 32px)`, page margin `clamp(16px, 4.5vw, 72px)`.
- Section rhythm: `padding-block: clamp(96px, 15vh, 200px)`.
- Radius: actions, chips, tabs and pills are **fully round** (`999px`). Structure
  (rows, cells, panels, forms) stays square on hairlines.
- Elevation comes from hairlines and background steps. Glow is reserved for red
  signal elements: the cursor, the burn edge, the primary hover, active callouts.

Breakpoints: `sm 640` · `md 900` · `lg 1200`.

---

## 5. Components

- **Section label**: `+ 03  HOW WE WORK` then a blood-red rule that draws itself.
- **Primary action**: a blood-red pill with a hot-red inner ring and a white label.
  On hover a gradient burn rises from the bottom with an ember glow. Magnetic within
  60px on fine pointers.
- **Secondary action**: the label between two red plus marks. On hover the marks turn
  90° and a hairline pill closes around the text.
- **Stat**: a large Ruthie numeral with a red suffix, over a blood-red dimension line.
  It counts up once on reveal. The value is also in a visually hidden span for screen
  readers.
- **Quote**: thin display text under a large red script quote mark (an ornament; the
  copy carries its own quotes).
- **Chip**: pill, uppercase label. "Live" chips are bone with a glowing red dot.
- **Marquee**: the technology list in Bebas Neue at display size, plus-mark separators.
- **Sigil** (`ui/Signature.tsx`): the geometry line art, drawn in on reveal.
- **Script band** (`ui/Signature.tsx`): the value "Ship over slideware" (from the About
  page) in huge Ruthie, drifting sideways with scroll. Alternate repeats are red.
- **Ring** (`ui/Signature.tsx`): circular "Book a call +" text turning slowly around a
  plus. A second way into Calendly, next to the home CTA.
- **FAQ**, **ruled lists**, **intake sheet**: structure unchanged, restyled with the
  new type, pills and plus-mark corners.

---

## 6. Motion

**Engine.** GSAP + ScrollTrigger for DOM motion, Lenis for inertia scroll, r3f
`useFrame` with damped springs for 3D. The fire is a plain 2D canvas driven by
`requestAnimationFrame` (`src/lib/fire.ts`).

| token | value | use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | reveals |
| loader | 1.2s count + 0.25s hold + 1.1s burn | first visit per session |
| transition | 0.85s cover + 1.05s reveal | route change |

**Fire** (`src/lib/fire.ts`). A red band between two ragged fronts. Each front is a
row of flame tongues: `1 - |sin|` has a cusp at every zero, so tips are pointed and
troughs round; a power narrows the tips, and two drifting frequencies stop it reading
as a pattern. The revealing front is charred black and stroked with a glowing edge.
Embers rise from whichever front is burning.

**Reduced motion** (`prefers-reduced-motion: reduce`): no loader, no fire (routes
swap with a fade), no Lenis, no scroll-scrubbed script band, no marquee, no ring
rotation, static waveform, and count-ups show final values.

---

## 7. 3D direction

One persistent `<Canvas>` behind the DOM. Route scenes are lazy chunks inside it.
All 3D is `aria-hidden` and has a DOM equivalent.

**Lighting.** Procedural environment, no HDR: a warm bone key from the top left, a
blood-red rim strip from the right, an ember fill from below, and a dark red-black
back wall. Fog goes to `--bg`.

**Materials.** Warm near-black metal (`#1E1717`). Source wireframes are additive
blood red (`#A8141A`), so an unbuilt object reads like the sigil line art. The burn
edge is `#E0121B` at HDR intensity, so it blooms on the high tier. Canvas textures
(screens, plates, labels, the guide booklet) use Stack Sans and Ruthie.

**The compile shader** (`src/three/compile.ts`) is unchanged in logic: fragments past
the cut are discarded, a noisy band at the cut is emissive, and a matching line
material shows edges only on the unbuilt side.

**Per page**

| route | scene | interaction |
|---|---|---|
| `/` | Phone rig: compiles on load, cycles the four live apps on its screen, explodes into Interface / Logic / Intelligence layers over the services, then reassembles for the work reel | scroll-scrubbed camera and phone poses, pointer tilt, magnetic buttons |
| `/services/` | Morphing point cloud (7 service forms) inside an orbit of 7 service modules, plus a 5-station assembly line for the process | drag to spin the orbit, click a module to morph, scroll the line |
| `/work/` | Depth corridor of case-study plates with a hover-distortion shader | fly through on scroll, hover to distort, click into the case |
| `/work/:id/` | The phone returns, showing that product's real screens. Products without screens get an abstract plate, never invented UI | scroll steps through the screens |
| `/ai-app-development/` | Network of 12 capability nodes in a neural field | cursor attracts and lights nodes, and the scripted chat pulses the network |
| `/devops-cloud-engineering/` | Stacked 3D reference architecture with packets flowing and a CI/CD ring | hover or tap a layer to light it and read it |
| `/about/` | Deliberately quiet: a depth-of-field bokeh field whose focal plane follows your reading position | scroll only |
| `/contact/` | Physics keycaps (cannon-es) for Book / Email / WhatsApp / LinkedIn | drag and throw. Click opens the channel. On phones, tilting changes gravity |
| industries ×4 | One template with a per-industry artefact: ledger bars, store grid, route network, org tree | pointer parallax |
| secondary | Hire: three pods · MVP: core/supporting/later rings · React Native: one source to two devices · Calculator: a weeks tower that grows with your selections · Guide: a fanned 8-page booklet · Blog: an archive field · 404: a failed build | per page |

**Quality tiers** (`src/lib/quality.ts`), chosen at start and adjusted at runtime.

| tier | when | what |
|---|---|---|
| `high` | fine pointer, WebGL2, ≥4 cores, no software renderer | DPR ≤ 1.75, bloom, full particle counts |
| `medium` | touch devices, mid GPUs | DPR ≤ 1.5, no post-processing, ~50% particles |
| `low` | software renderer, ≤2GB memory, Save-Data, or a sustained frame drop | DPR 1, static camera, ~20% particles |
| `off` | no WebGL | an SVG line-drawing poster of the scene, in blood red |

**Mobile is designed, not degraded.** Below 900px the hero phone follows device tilt
(with an iOS permission chip), `/contact/` tilt changes gravity, scroll-scrub becomes
per-section pose snaps, and opaque sections pause rendering.

---

## 8. Signature details

1. **Loader.** A Ruthie counter `000 → 100`, near-black on blood red, with the grain
   over it. Then the burn. First visit per session only, never under reduced motion.
   It never waits for input: a click adds sound and jumps to the burn, Esc skips.
2. **Flame wipe** on every internal route change, with the destination name in
   script on the red (`src/components/shell/Transition.tsx`).
3. **Bottom bar**: the sound waveform (left), `+ DESIGN + BUILD + SHIP +` (centre, the
   word matching scroll progress is lit), and `route · section · %` (right). Below
   900px only the waveform shows. It hides while the mobile menu is open.
4. **Sound** (`src/lib/sound.ts`). Synthesized in WebAudio, no audio files: a low
   detuned drone through a slowly breathing low-pass, a soft fire roar and sparse
   crackle, plus a rising gust with each flame wipe. **Off by default.** It can only
   start from a user gesture: the waveform button (`aria-pressed`) or a click on the
   loader. The waveform bars read the live analyser when on.
5. **Cursor.** A red point with a lagging ember glow. The glow grows over links and
   becomes a solid blood disc with a label (`VIEW`, `BOOK`, `SOUND`) over elements
   with `data-cursor`. Hidden on coarse pointers; never replaces focus styles.
6. **Film grain** at 7% (`overlay`), above everything including the loader's red.
7. **Footer signature.** A giant blood-red "Soni" in Ruthie that the footer ends on,
   drawn from CSS `content` so it is pure decoration.

---

## 9. Accessibility

- A skip link, landmarks, one `h1` per page, logical heading order.
- Focus: a 2px `--signal` outline with a 3px offset on every interactive element.
- The mobile menu is a modal dialog with a focus trap, Esc to close and focus return.
- All 3D and all fire are `aria-hidden`. Every 3D interaction has a DOM equivalent.
- Contrast meets WCAG AA in both themes (§2). Verified 2026-09-27 with axe-core
  (wcag2a + wcag2aa): 0 violations on `/`, `/work/`, a case study, `/about/`,
  `/contact/`, the calculator and `/blog/`, in both themes.
- Sound never autoplays and is off by default; the toggle is a labelled button.
