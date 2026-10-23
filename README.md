# AZ-900 Flashcard Coach

**Unofficial study tool. Not affiliated with or endorsed by Microsoft.**

Live app: https://mukta-55.github.io/az900-flashcard-coach/

A spaced-repetition flashcard app for people preparing for the Microsoft Azure Fundamentals (AZ-900) exam. It was built for the #1MillionDevs Vibe Coding Hackathon (AZ-900 Exam Prep Edition) and is designed for self-studying learners, especially those on phones with limited data.

## The problem

AZ-900 has a lot of terms that look alike: regions and availability zones, LRS and GRS, Entra ID and Entra Domain Services, Azure Policy and resource locks. Reading notes once does not make them stick, and learners rarely know which concepts they keep getting wrong.

## What it does

The app shows short cards, asks you to rate how well you knew each answer, and brings back the cards you miss more often than the ones you know. It uses the Leitner system, a simple form of spaced repetition with five boxes.

## Who it is for

- Self-studying learners preparing for AZ-900
- People who study on a phone in short sessions (5 to 15 minutes)
- People with unreliable or expensive data: after the first visit the app works offline

## Features

### Learning engine

- Leitner system with 5 boxes (review intervals of 1, 2, 4, 8 and 16 days)
- Three answer buttons after flipping a card: **Missed it** (back to Box 1), **Almost** (stays in the same box) and **Got it** (up one box)
- **Trouble cards**: cards with 3 or more misses that are still in Box 1 or 2 get their own study mode
- **Mastered cards**: cards in Box 5 whose last two answers were "Got it"
- Daily new-card goal and an optional exam date with a countdown
- Streak counter for consecutive study days
- Session order: due cards (most overdue first), then trouble cards, then new cards

### Content

- 132 cards covering all 54 skill bullets in the AZ-900 skills outline, with at least two cards per bullet
- Card types: 85 definition, 28 scenario and 19 compare cards
- Compare cards for pairs that are easy to mix up, with an "Often confused with" panel
- Every card records the exact outline bullet it covers (`skill_ref`)
- Analogies use everyday settings (schools, cooperatives, shops). They never claim a real company uses Azure.
- All cards are written from scratch. They are not real exam questions.

### Screens

1. **Onboarding**: welcome, exam date, daily goal
2. **Home**: due, new and trouble counts, streak, days until the exam, mastery per topic area
3. **Study**: flip the card, answer buttons, progress bar, undo, session summary
4. **Browse**: search and filter the deck
5. **Progress**: mastery per area, cards per box, recent history
6. **Settings**: daily goal, exam date, theme, export and import of progress, reset

### Technical

- React, TypeScript, Vite and Tailwind CSS
- Progress is saved in the browser (`localStorage`) with error handling for blocked or full storage
- Service worker for offline use after the first visit
- Dark, light and system themes
- Keyboard shortcuts while studying: Space to flip, 1/2/3 to answer
- Export and import of progress as a JSON file

## Run it locally

```bash
npm install
npm run dev
```

Open the address printed in the terminal. The dev server is configured for port 3000, and because the app is built for GitHub Pages the path may include `/az900-flashcard-coach/`.

To build for production:

```bash
npm run build
```

## Deploy to GitHub Pages

The repository deploys automatically with GitHub Actions on every push to `main`.

1. In the repository, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
2. The workflow is in `.github/workflows/deploy.yml`. It installs dependencies, builds the app and publishes the `dist` folder.
3. `vite.config.js` sets `base: "/az900-flashcard-coach/"`. If you rename the repository, change this value to match, or the page will load blank.
4. The service worker is registered with a relative path (`./sw.js`) and caches relative paths, so it works under the repository sub-path.

## Project structure

```
src/
├── App.tsx          # All screens
├── types.ts         # Types and constants
├── data/
│   └── cards.ts     # The flashcard deck
├── engine/
│   ├── leitner.ts   # Spaced-repetition logic
│   └── storage.ts   # localStorage wrapper
├── index.css        # Tailwind and design tokens
└── main.tsx         # Entry point and service worker registration

public/
├── manifest.json    # Web app manifest
└── sw.js            # Service worker
```

## How it was built

- **Prompt:** the prompt that specified the app is in [PROMPT.md](PROMPT.md), together with what changed from it and why.
- **Code:** Qwen Coder generated the app. The prompt asked for plain HTML, CSS and JavaScript, but Qwen built it in its own React, Vite and Tailwind setup, and the project stayed in that stack.
- **Deployment:** set up with GitHub Actions and GitHub Pages. The Vite base path and the service worker paths were fixed so the app works under the repository sub-path.

## How the deck was reviewed

- The scope comes only from the AZ-900 skills outline copied from Microsoft Learn. No topic outside it was added.
- Qwen generated the first version of the deck. It was then reviewed with help from Claude, using Microsoft Learn and other web sources.
- Claims were checked one at a time and the errors found were corrected. Examples: AzCopy does not support Table storage in its current version; with GRS the secondary copy is readable only after a failover; Azure Germany is no longer a current sovereign-region example; the Microsoft Defender for Cloud and Microsoft Purview descriptions were outdated or incomplete.
- Every card's `skill_ref` was set to the exact outline wording.
- The plain definition cards were read through but not each looked up individually, so errors may remain. Check anything important against Microsoft Learn.
- One card states a hedged figure ("about 300 miles" between region pairs) because Microsoft's own training material uses it.

## Adding another certification

The deck is a plain data file (`src/data/cards.ts`) and each card has the same fields: `id`, `skill_area`, `skill_ref`, `type`, `front`, `back`, `explanation`, optional `example` and `confused_with`, `difficulty` and `needs_verification`. Another certification would need a new data file in the same format and a way for the app to load it. A deck selector is not built yet.

## Known limitations

- Progress is stored on one device only. Use Export and Import to move it. There is no cloud sync.
- The first visit needs an internet connection. After that the app works offline.
- Install-to-home-screen icons are missing: the manifest points to icon files that are not in the repository, so the install experience is incomplete.
- Mastery bars are per topic area (11 areas), not per exam domain, so they do not mirror the exam weightings.
- "Deck mastery" shows how much of the deck you have learned. It does not predict an exam result.
- Undo reverses only the last answer.
- The deck may contain mistakes and may fall behind future changes to the exam. It is a study aid, not an official source.

## Disclaimer

This is an **unofficial** study tool. It is not affiliated with, endorsed by or connected to Microsoft. Microsoft, Azure and AZ-900 are names owned by Microsoft.
