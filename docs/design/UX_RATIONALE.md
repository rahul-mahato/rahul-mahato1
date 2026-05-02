# MemoryOS — UI/UX Design Rationale

**Companion to:** `docs/design/orb-prototype.html`
**Spec:** SRS v1.0.0 (May 2026)
**Author:** UI/UX pass
**Date:** May 2026

> This is the canonical UX brief. The React Native app under `src/` is the
> implementation; this is the *why*. Before changing anything visual or
> interactive, re-read at least §1, §3, §5, §6, and §10. If your change
> seems to disagree with this doc, the doc usually wins — open a PR to
> update both together.

---

## 1. North Star

> **"Talking to MemoryOS should feel like talking to Siri — but the conversation is with your own past self, and nothing ever leaves your phone."**

Three commitments fall out of that one sentence, and every design decision below traces back to one of them:

1. **Voice-first, but never voice-only.** A Siri-like focal point, with full parity for keyboard, touch, and screen-reader users.
2. **Privacy you can *feel*, not just read about.** The spec's biggest differentiator (zero-knowledge, on-device) has to be visible at a glance, not buried in settings.
3. **Calm, not clever.** Memory is intimate. The UI should feel like a lamp in a dark room, not a dashboard.

---

## 2. Who We're Designing For

Pulled directly from the spec's three personas, then translated into design pressure:

| Persona | What they need from the UI | Design pressure it creates |
|---|---|---|
| The High-Performer | Instant recall, zero friction, often mid-task | Sub-second perceived latency. Type path must be as fast as voice. Keyboard shortcuts (Space to talk, Esc to cancel). |
| The Lifelong Learner | Surfaces knowledge during *other* tasks | Proactive "Insight Cards" on the home surface — not a separate notifications screen. |
| The Reflective Journaler | Long, emotional, often voice entries | Generous space, serif typography for emotional weight, no streak-counters or gamification. |

A fourth, implicit persona shaped a lot of the accessibility work: **the user who can't or doesn't want to speak aloud right now** — on a train, in a meeting, hard of hearing, or simply private. They get a first-class type path, not a fallback.

---

## 3. The Core Interaction: One Orb, Three Paths

The whole product collapses into a single recognisable gesture, exactly like Siri:

```
        ┌─────────────────────────┐
        │      THE ORB            │
        │  (idle / listening /    │
        │   thinking / answered)  │
        └─────────────────────────┘
           ▲          ▲          ▲
           │          │          │
        TAP/HOLD   PRESS SPACE   TYPE
        (touch)    (keyboard)   (always visible)
```

### Why an orb, not a chat thread?

A scrolling chat UI implies *history you scroll through*. That's the "archive trap" the spec explicitly calls out as the problem. An orb implies *a thing you ask*. The mental model shifts from "where did I put that note" to "let me ask my past self" — which is exactly the value prop.

### State machine (what the orb communicates)

| State | Visual | Status text (also announced via `aria-live`) | Trigger |
|---|---|---|---|
| **idle** | Soft amber glow, slow 5.5s breathing halo | "Tap the orb, or press Space to speak." | Default |
| **listening** | Pressed-in shadow, animated waveform overlay, brighter halo | "**Listening…** say anything, or tap to stop." | Tap / Space |
| **thinking** | Halo dims, no waveform | "**Thinking on-device…** searching your memories." | Stops listening |
| **answered** | Returns to idle glow; answer panel rises in below | "Tap the orb to ask another question." | RAG complete |

Every state is communicated through **three redundant channels**: visual (orb appearance), textual (status line), and assistive-tech (live region announcement). No state is conveyed by colour or motion alone — a WCAG 1.4.1 requirement, but more importantly the right thing to do.

> **Implementation note (RN):** the Space-to-speak hint is only shown when
> `Platform.OS === 'web'` — see `src/app/(drawer)/index.tsx`.

---

## 4. Information Architecture

The home screen has exactly four zones, in priority order:

```
┌──────────────────────────────────────────────┐
│  [MemoryOS]              [On-device · 0 sync]│  ← 1. Privacy proof (always visible)
├──────────────────────────────────────────────┤
│                                              │
│  Good evening, Rahul.                        │  ← 2. Greeting + intent prompt
│  What do you want to remember?               │
│                                              │
│             ╭─────────╮                      │
│             │   ORB   │                      │  ← 3. The conversation
│             ╰─────────╯                      │
│         [ status text ]                      │
│   [Ask] [Capture] [Timeline]                 │
│                                              │
│  ┌────────────────────────────────┐         │
│  │ Or just type…                  │         │
│  └────────────────────────────────┘         │
│                                              │
│  ─── Answer surface (when active) ───       │
│                                              │
├──────────────────────────────────────────────┤
│  This week's synthesis                       │  ← 4. Proactive insights
│  [card] [card] [card]                        │
├──────────────────────────────────────────────┤
│  0 outbound requests today.  See audit log → │  ← Privacy moat, made tangible
└──────────────────────────────────────────────┘
```

The deliberate **absence** of a tab bar matters. Tabs would force a choice ("am I capturing or asking?") that the spec's "chat-native" goal rejects. The orb does both; everything else is a side surface revealed on demand.

> **Implementation note (RN):** the app uses a hidden drawer (Ask /
> Memories / Insights / Settings) instead of a tab bar — same intent, the
> drawer doesn't visually compete with the orb.

---

## 5. Privacy as Visual Language

The spec calls zero-knowledge architecture "the moat." A moat you can't see isn't a moat to the user. So privacy is woven into the chrome at three different intensities:

1. **Ambient (always on):** A pill in the top bar — "On-device · 0 sync" with a gently pulsing safe-green dot. Calm, not anxious. *(Implementation: `src/components/PrivacyPill.tsx`.)*
2. **In-the-moment:** When the orb is thinking, the status text says **"Thinking on‑device…"** — the word *on-device* shows up exactly when a user might worry their thoughts are being shipped somewhere.
3. **On demand:** A dashed strip near the bottom — "0 outbound requests today" — links to a full audit log (spec §5, Privacy Audit Logs). Dashed border signals "transparent boundary," not solid wall. *(Implementation: `src/components/PrivacyStrip.tsx`.)*

This avoids the common privacy-UI mistake of a single padlock icon that conveys nothing. The user is reminded passively, reassured actively, and given proof on demand.

---

## 6. Accessibility Commitments

These aren't a checklist tacked on at the end — they shaped early decisions.

### 6.1 Voice-first ≠ voice-only

Every voice action has at least two non-voice equivalents:

| Action | Voice | Touch | Keyboard |
|---|---|---|---|
| Start listening | (planned: wake word) | Tap orb | Press Space |
| Stop listening | Pause | Tap orb again | Space or Esc |
| Submit a question | Speak | Tap Send | Enter |
| Pick a suggestion | "Ask my past self" | Tap chip | Tab + Enter |

### 6.2 Targets and motor accessibility

- **Minimum 48px tap targets** on every interactive element (WCAG 2.5.5 Level AAA target size). The orb itself is 170px — generous on purpose.
- **No drag, swipe, or long-press required** for any primary action. All three paths to the orb are single-step.
- **No timeouts** on the answer surface. A user reading slowly never loses their place.

### 6.3 Visual accessibility

- **Visible 3px focus ring** in the amber accent colour, with 3px offset, on every focusable element. Never hidden, never `outline: none`.
- **Skip-link** (first tab stop) jumps past the chrome to `#main`.
- **Heading order** is strict: one `<h1>` (greeting), `<h2>` for sections, hidden `<h2>` for the orb itself so it's reachable by screen-reader heading navigation.
- **`prefers-contrast: more`** automatically bumps dim text colours and border lines toward higher contrast.
- **Text contrast** meets WCAG AA on every surface; primary text exceeds AAA.

### 6.4 Motion accessibility

`prefers-reduced-motion: reduce` flips off:
- the breathing halo around the orb
- the listening waveform animation
- the privacy-dot pulse
- the rise-in animation on the answer panel

The interface still works perfectly with all motion stripped — nothing depends on animation to convey meaning. *(Implementation: `src/hooks/useReducedMotion.ts`, consumed by `Orb`, `PrivacyPill`, `AnswerSurface`, `CaptureToast`.)*

### 6.5 Screen-reader experience

- The orb is a `<button>` (not a `<div>` with `role`) with `aria-pressed` reflecting listening state, and `aria-describedby` pointing at the status text.
- The status text is a `role="status"` `aria-live="polite"` region. Every state change is read aloud without interrupting whatever the user was doing.
- The answer panel has `tabindex="-1"` and receives programmatic focus when an answer arrives — so a screen reader jumps straight to the synthesised answer, then the user can navigate down through cited memories. *(Implementation: `AnswerSurface` calls `AccessibilityInfo.setAccessibilityFocus`.)*
- All decorative SVGs are `aria-hidden="true"`. Functional buttons have `aria-label`s describing intent, not appearance.

### 6.6 Cognitive accessibility

- Plain-language labels: "Ask your past self," "Quick capture," not "Semantic Query" or "Ingest."
- The greeting is a question — *"What do you want to remember?"* — which is easier to act on than a blank canvas.
- Insight cards lead with a category tag (RECURRING THEME, MOOD SHIFT, OPEN THREAD) so the user knows what kind of thing they're looking at before reading.

---

## 7. Aesthetic Direction

A deliberate move *away* from the AI-app cliché (purple-blue gradients, glassmorphism, neon).

| Choice | Why |
|---|---|
| **Warm off-black canvas** (`#13110f`) with a single luminous orb | Memory is intimate, often nighttime. A dark surface focuses attention; a single warm light source feels like a lamp, not a dashboard. |
| **Amber/cream glow** instead of cool blue | Warmth signals "personal," "human." Cool blues signal "system," "corporate." Wrong feeling for a memory tool. |
| **Fraunces (serif) for human moments + Geist (sans) for system text** | Quoted memories appear in serif italic — they read like a voice. UI chrome is sans — clean, recedes. The pairing does a lot of emotional work. |
| **Geist Mono for dates and metadata** | Tabular figures align cleanly; mono signals "this is fact, not interpretation" — important for cited memory sources. |
| **Generous negative space, single column, max-width 880px** | Resists dashboard-itis. A memory tool that feels crowded feels stressful. |

What this **avoids**: glassmorphism, purple gradients, hero illustrations of brains-with-circuits, "AI sparkle" iconography, fake chat-bubble UI, gamification streaks.

> **Implementation note:** tokens live in `src/theme/tokens.ts`. The typed
> `<Text variant>` component in `src/theme/text.tsx` enforces these
> choices — `serifItalic` for synthesis, `serifQuote` for cited memories,
> `mono` for dates, `body`/`bodyDim` for chrome.

---

## 8. The Answer Surface (RAG made legible)

When you ask a question, the response surface follows a deliberate three-part structure:

```
You asked — "Why did I decide against that new job in February?"

  On Feb 14 you decided to stay — you wrote that the new role
  "solved a salary problem but created a meaning problem,"
  and you weren't willing to make that trade again.

  ─── Memories used to answer ───
  Feb 14   "…solved a salary problem but created a meaning problem."
  Feb 09   "Talked to Priya about it. She asked what I'd miss most."
  Jan 28   "Offer came in. Bigger title. Bigger team. Smaller scope."
```

Three design decisions in there:

1. **Echo the question back** in italic — reassures the user the system heard them correctly, and gives screen-reader users a clean re-entry point.
2. **The synthesis is in serif italic** — it reads as *your own voice* being quoted back, not as an AI generating new prose.
3. **Cited sources are always visible**, dated, and tappable. This is the spec's RAG architecture made transparent: the user sees exactly which memories produced the answer. No hallucination hiding place. *(Implementation: each source is a `Pressable` that opens the underlying memory in the editor.)*

---

## 9. Proactive Insights ("This Week's Synthesis")

The spec asks for weekly Memory Synthesis reports. The temptation is to make them a separate screen with a notification badge. I put them on the home surface instead, as three calm cards under the orb, because:

- **Discovery, not interruption.** A red badge says "you have unread duties." Cards on the home screen say "here's what I noticed, when you're ready."
- **One pattern per card.** Each card is a single sentence with the surprising part in italic — readable in under three seconds.
- **Category tag up top** (RECURRING THEME / MOOD SHIFT / OPEN THREAD) tells the user what *kind* of pattern it is, so they can choose what to engage with.

Three cards is also a deliberate ceiling. More than three patterns competing for attention turns synthesis into anxiety. *(Implementation: `SynthesisPreview` slices to 3; the deeper Insights drawer screen can show more once Phase 3 lands.)*

---

## 10. What I Deliberately Left Out (and Why)

| Not included | Reasoning |
|---|---|
| Tab bar / bottom nav | Forces premature choice between capture and recall. The orb subsumes both. |
| Search bar in header | Redundant with the orb + type field. Two search affordances confuses the model. |
| Streaks, counters, "you've journaled X days" | Spec's persona 3 is the reflective journaler. Gamification turns reflection into performance. |
| Dark/light mode toggle | Single warm-dark theme is intentional. A bright white memory app would feel clinical. (Could be revisited based on user research.) |
| Chat-bubble transcript view | Implies the archive trap. The orb + answer panel handles single Q&A; long browsing happens in the Timeline view (chip → side surface). |

---

## 11. Open Questions for User Research

Things I'd want to validate before shipping:

1. **Does the orb's "listening / thinking / answered" loop feel like Siri to actual users, or is the metaphor only obvious to designers?**
2. **Is the privacy pill reassuring or anxiety-inducing?** Always-visible privacy chrome can backfire — calling attention to a worry the user didn't have.
3. **How do reflective journalers react to seeing their own past words quoted back in italic serif?** It could feel beautiful, or it could feel uncanny. Worth testing both directions.
4. **Should the "Quick capture" chip become a long-press of the orb instead?** That would unify capture and recall into a single gesture — but might violate "no long-press required." Trade-off worth measuring.
5. **One-handed thumb reachability on phones >6.5".** The orb sits in the upper-middle of the screen on the prototype; a thumb-zone variant might anchor it lower.

---

## 12. Next Iterations

If we go another round, in priority order:

1. **Earcon / sound-design pass.** Voice-first UIs lean heavily on non-speech audio for blind users — a soft chime on listen-start, a different one on answer-ready. Currently silent.
2. **Thumb-zone mobile layout** with the orb anchored to the bottom third for one-handed use.
3. **Capture confirmation pattern.** Right now the prototype only shows the *recall* path. Capture needs its own micro-flow: speak → see transcript → confirm or edit → saved (with a clear "this stayed on your device" confirmation). *(Started: `CaptureToast` shows a calm "Saved. This stayed on your device." after typed captures. Voice capture flow still TBD.)*
4. **Empty state** for a brand-new user with zero memories. The orb metaphor breaks down with nothing to ask — needs a gentle onboarding without becoming a tutorial.
5. **Audit log screen** (currently just linked). Should show a chronological list of every model run, every embedding, every (zero) outbound request — making the privacy claim auditable rather than asserted.

---

## 13. Mapping Back to the Spec

A quick check that every functional requirement has a UI surface:

| Spec requirement | Where it lives in the UI |
|---|---|
| Unified ingestion (text / voice / image) | Orb (voice), type field (text), Quick Capture chip (image — to be expanded) |
| Semantic querying ("Ask your past self") | Orb + answer surface, with cited sources |
| Proactive Insights / Weekly Synthesis | "This week's synthesis" cards on home |
| Temporal Navigation / Mental Milestones | Timeline chip / Memories drawer |
| Zero-knowledge architecture | Privacy pill (top bar) + on-device status text + audit-log strip |
| Privacy Audit Logs | "See audit log →" link in the privacy strip |
| Local-first / offline | Implied throughout; "On-device · 0 sync" pill makes it explicit |

Everything in the spec has a home. Nothing in the UI is purely decorative.
