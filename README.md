# AZ-900 Flashcard Coach

**Unofficial study tool. Not affiliated with or endorsed by Microsoft.**

A spaced-repetition flashcard app for learners preparing for the Microsoft Azure Fundamentals (AZ-900) exam. Built for self-studying learners, especially those on phones with limited data.

## Problem It Solves

Learners struggle to remember Azure terms, services, and concepts. This tool uses the Leitner system (spaced repetition with 5 boxes) to help learners revise key concepts and spend more time on cards they keep getting wrong.

## Target Users

- Self-studying learners preparing for AZ-900
- Mobile-first (works from 360px wide)
- Short study sessions (5–15 minutes)
- Works offline after first load

## Features

### Learning Engine
- **Leitner system** with 5 boxes (intervals: 1, 2, 4, 8, 16 days)
- **Three answer buttons**: Missed it (→ Box 1), Almost (stay), Got it (↑ next box)
- **Trouble cards**: cards with 3+ lapses in Box 1-2 get dedicated study mode
- **Mastered cards**: Box 5 cards with last two answers "Got it"
- **Exam date**: optional countdown that caps review intervals
- **Streak tracking**: consecutive days with at least one review
- **Session queue**: due cards (most overdue first), then trouble cards, then new cards

### Content
- 108+ flashcards covering all 54 skill bullets in the AZ-900 outline
- Card types: definition, compare, scenario, acronym
- "Often confused with" panels for commonly mixed-up concepts
- Real-life analogies (schools, cooperatives, shops) - no real company claims
- All content written from scratch, no reproduced exam questions

### Screens
1. **Onboarding** (3 steps): welcome, exam date, daily goal
2. **Home**: due/new/trouble counts, streak, mastery bars, start session
3. **Study**: flip card, answer buttons, progress bar, undo, session summary
4. **Browse**: search, filter by area/type, view any card
5. **Progress**: mastery per area, cards per box, 14-day history (inline SVG)
6. **Settings**: daily goal, exam date, theme, export/import, reset

### Technical
- React + Vite + Tailwind CSS
- All progress stored in localStorage (with try/catch for storage errors)
- Service worker for offline support
- Web app manifest (installable on phones)
- Dark/light/system theme support
- WCAG AA contrast, 44px minimum tap targets
- Keyboard shortcuts during study (Space to flip, 1/2/3 to answer)
- Export/import progress as JSON backup

## How to Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Set Source to "GitHub Actions"
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

5. The app will be available at `https://<username>.github.io/<repo>/`

## Architecture

```
src/
├── App.tsx          # Main app with all screens
├── types.ts         # TypeScript types and constants
├── data/
│   └── cards.ts     # Flashcard deck (JSON-like data)
├── engine/
│   ├── leitner.ts   # Learning engine (spaced repetition)
│   └── storage.ts   # localStorage wrapper
├── index.css        # Tailwind + design tokens
└── main.tsx         # Entry point + SW registration

public/
├── manifest.json    # PWA manifest
└── sw.js            # Service worker
```

## How the Deck Was Verified

- Every card maps to a specific bullet in the official AZ-900 skills outline
- Each outline bullet has at least 2 cards
- Compare cards cover commonly confused concept pairs
- No numbers that change (prices, SLAs, quotas) are stated
- Real-life examples are analogies only
- Cards with uncertain facts are marked `needs_verification: true`

## Adding Another Certification

The card deck is data, not code. To add another certification:

1. Create a new file in `src/data/` (e.g., `aws-cloud-practitioner.ts`)
2. Follow the same card schema (id, skill_area, skill_ref, type, front, back, explanation, etc.)
3. Update `SKILL_AREAS` in `types.ts` with the new certification's areas
4. Import the new deck in the relevant screen components

## Known Limitations

- Progress is stored only in localStorage (one device). Use Export/Import to transfer.
- No cloud sync between devices
- Service worker caches assets but not dynamic content
- Undo only goes back one card (does not reverse box changes)
- Icons are placeholder (PWA install works but shows default icon)

## Disclaimer

This is an **unofficial** study tool. It is not affiliated with, endorsed by, or connected to Microsoft Corporation. AZ-900 is a trademark of Microsoft Corporation.
