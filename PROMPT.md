# Prompts used to build AZ-900 Flashcard Coach

This file records the main prompt that specified the app, why it is written the way it is, what happened when it was run, and what would be changed next time.

## Summary

| Version           | Used with                                             | What it asked for                                                | Outcome                                                                                                   |
| ----------------- | ----------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| v1                | Not run                                               | The full brief, with a placeholder where the skills outline goes | Replaced by v2 before use, because the outline had not been supplied                                      |
| v2 (final, below) | Qwen Coder, and a separate Claude chat to test Step 0 | The same brief with the official skills outline pasted in        | Qwen built the app that is deployed. The Claude chat followed the method but did not build the final app. |

## The problem the prompt had to solve

The author used free-tier Claude, which runs out of messages on a large build, and wanted to give a longer task to Qwen. Four requirements shaped the prompt:

1. Avoid hallucinations, clichés and generalized answers.
2. Solve a real problem: help people prepare for AZ-900.
3. Be usable by real people straight away.
4. Have a clear, app-like interface.

The biggest risk was content accuracy. A model that fills gaps from memory will write confident but wrong Azure facts, and the hackathon scores content accuracy.

## Why the prompt is written this way

| Choice in the prompt                                                                           | Reason                                                                                                    |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| The official skills outline is pasted into the prompt and declared the only source of scope    | Stops the model recalling an older exam version. The outline changed on 14 January 2026.                  |
| Rules against changing numbers (prices, SLAs, quotas, limits, region counts)                   | These go out of date and are a common source of wrong cards.                                              |
| "If you are not certain, set `needs_verification: true`"                                       | Gives the model a safe option other than guessing.                                                        |
| Analogies only, never claims that a real company uses Azure                                    | Avoids invented claims about real organizations.                                                          |
| Hackathon rules written in: no real exam questions, no Microsoft logos, an "unofficial" notice | Keeps the submission within the rules.                                                                    |
| An exact learning engine (Leitner boxes, answer buttons, trouble cards, session order)         | Ambiguous wording would lead to guessed behavior. The rules are testable.                                 |
| A fixed card schema, including the exact outline bullet each card covers                       | Makes coverage checkable bullet by bullet.                                                                |
| Static web app, no backend, offline support, saved in the browser                              | Target users are on phones with limited data, and a free static host means anyone can use it immediately. |
| One step per reply, then stop and wait for "next"                                              | Keeps each output complete and reviewable instead of one huge reply that gets cut off.                    |
| A self-check at the end of each step                                                           | Makes the model list which rules its own output may have broken.                                          |
| Step 0 makes the model confirm the bullet count and give a per-bullet coverage table           | Lets the author check coverage before any code is written.                                                |

## Prompt v2 (final)

```
ROLE
You are a senior software engineer with 30 years of experience shipping production web applications and learning products. You write complete, working code. You do not write placeholders, "TODO" comments, or "etc." inside code.

PROJECT
Build "AZ-900 Flashcard Coach", an UNOFFICIAL study tool for learners preparing for the Microsoft Azure Fundamentals (AZ-900) exam. It is an entry in a hackathon whose judges score: learning value and content accuracy (25%), UX (15%), technical creativity and clean code (15%), documentation (10%), and scalability to other certifications.

PROBLEM IT SOLVES
Learners struggle to remember Azure terms, services and concepts. The tool must help them revise key concepts and spend more time on the cards they keep getting wrong.

TARGET USERS
Self-studying learners in Africa, mostly on phones, often on slow or intermittent data. They study in short sessions of 5 to 15 minutes.

NON-NEGOTIABLE CONTENT RULES (accuracy)
1. The official skills outline below is your ONLY source for scope. Do not add topics that are not in it. Do not rely on memory of older versions of the exam.
2. Write every card in your own words. Do not reproduce real exam questions, braindump content, or text copied from Microsoft documentation.
3. Never state numbers that change or that you cannot guarantee (prices, SLA percentages, quotas, limits, region counts). If a card needs such a number, rewrite the card so it tests the concept instead.
4. If you are not certain a fact is correct, do not guess. Set "needs_verification": true on that card and list it in a verification report. A shorter, correct deck is better than a longer deck with errors.
5. Real-life examples must be analogies only (for example: a school, a farmers' cooperative, a SACCO, a mobile-money agent, a small shop). Never claim that any real company or product uses Azure or any Azure service.
6. No Microsoft or Azure logos, no four-square Windows mark, no imitation of Microsoft branding. Put "Unofficial study tool. Not affiliated with or endorsed by Microsoft." in the footer of every screen and in the README.
7. Plain, direct language. No marketing phrases, no motivational filler, no emoji-heavy copy.

OFFICIAL SKILLS OUTLINE (source of truth, from Microsoft Learn)

Domains at a glance:
- Describe cloud concepts (25–30%)
- Describe Azure architecture and services (35–40%)
- Describe Azure management and governance (30–35%)

1. Describe cloud concepts (25–30%)
  Describe cloud computing
  - Define cloud computing
  - Describe the shared responsibility model
  - Define cloud models, including public, private, and hybrid
  - Identify appropriate use cases for each cloud model
  - Describe the consumption-based model
  - Compare cloud pricing models (CapEx vs. OpEx)
  Describe the benefits of using cloud services
  - Describe the benefits of high availability and scalability in the cloud
  - Describe the benefits of elasticity and predictability in the cloud
  - Describe the benefits of security and governance in the cloud
  - Describe the benefits of manageability in the cloud
  Describe cloud service types
  - Describe Infrastructure as a Service (IaaS)
  - Describe Platform as a Service (PaaS)
  - Describe Software as a Service (SaaS)
  - Identify appropriate use cases for each cloud service type (IaaS, PaaS, SaaS)

2. Describe Azure architecture and services (35–40%)
  Describe the core architectural components of Azure
  - Describe Azure regions, region pairs, and sovereign regions
  - Describe Availability Zones
  - Describe Azure datacenters
  - Describe Azure resources and Resource Groups
  - Describe Azure Subscriptions
  - Describe Azure Management Groups
  - Describe the hierarchy of resource organization (Management Groups > Subscriptions > Resource Groups > Resources)
  Describe Azure compute and networking services
  - Describe compute types, including Container instances, Virtual Machines (VMs), and Functions
  - Describe VM options, including Azure Virtual Machines, Azure VM Scale Sets, Availability Sets, and Azure Virtual Desktop
  - Describe resources required for virtual machines
  - Describe application hosting options, including Web Apps, containers, and virtual machines
  - Describe virtual networking, including Azure Virtual Networks, subnets, peering, Azure DNS, VPN Gateway, and ExpressRoute
  - Describe public and private endpoints
  Describe Azure storage services
  - Describe Azure Storage services (Blob, Disk, File, Table, Queue)
  - Describe storage tiers (Hot, Cool, Cold, Archive)
  - Describe storage redundancy options (LRS, ZRS, GRS, GZRS, RA-GRS)
  - Describe options for data migration and file management (AzCopy, Azure Storage Explorer, Azure File Sync, Azure Data Box, Azure Migrate)
  Describe Azure identity, access, and security
  - Describe directory services in Azure, including Microsoft Entra ID and Microsoft Entra Domain Services
  - Describe authentication methods, including Single Sign-On (SSO), Multi-Factor Authentication (MFA), and passwordless
  - Describe external identities and guest access in Microsoft Entra ID
  - Describe Microsoft Entra Conditional Access
  - Describe Azure Role-Based Access Control (RBAC)
  - Describe Zero Trust model concepts
  - Describe defense-in-depth principles
  - Describe Microsoft Defender for Cloud capabilities

3. Describe Azure management and governance (30–35%)
  Describe cost management in Azure
  - Describe factors that affect costs in Azure
  - Describe the Pricing Calculator and Total Cost of Ownership (TCO) Calculator
  - Describe Microsoft Cost Management features
  - Describe the purpose and implementation of Azure tags
  Describe features and tools in Azure for governance and compliance
  - Describe Microsoft Purview features
  - Describe Azure Policy and policy initiatives
  - Describe Resource Locks and their scope
  - Describe the Service Trust Portal and Trust Center
  Describe features and tools for managing and deploying Azure resources
  - Describe management options: Azure Portal, Cloud Shell, Azure CLI, Azure PowerShell, and Azure mobile app
  - Describe Azure Arc capabilities
  - Describe Infrastructure as Code (IaC) principles
  - Describe Azure Resource Manager (ARM) and ARM templates / Bicep
  Describe monitoring tools in Azure
  - Describe Azure Advisor recommendations
  - Describe Azure Service Health
  - Describe Azure Monitor, including Log Analytics, alerts, and Application Insights

TECHNICAL CONSTRAINTS
- Static web app: HTML, CSS and vanilla JavaScript (ES modules). No framework, no build step, no backend, no external CDN, no web fonts (use a system font stack). It must run by opening index.html through any static host and deploy to GitHub Pages unchanged.
- Works offline after the first load (service worker plus web app manifest, installable on a phone).
- All progress is stored in localStorage. Wrap every read and write in try/catch and handle the case where storage is empty, full or blocked.
- Use only standard browser APIs that you are certain exist. Do not invent APIs or library functions.
- The card deck is DATA, not code: JSON files, so another certification can be added by dropping in a new deck.
- Time logic uses local calendar days and an injectable clock function so it can be tested.

LEARNING ENGINE (implement exactly this)
- Leitner system with 5 boxes. Review intervals in days: Box1=1, Box2=2, Box3=4, Box4=8, Box5=16.
- Three answer buttons after the card is flipped:
  "Missed it": card goes to Box 1, lapses +1, and it re-appears later in the same session after at least 5 other cards (or at the end if fewer remain).
  "Almost": card stays in its current box and becomes due the next day.
  "Got it": card moves up one box (max Box 5) and its due date is set by the new box interval.
- New cards: a daily limit of new cards, default 10, adjustable in Settings from 5 to 30.
- Trouble cards: a card with lapses >= 3 and currently in Box 1 or 2. They get their own study mode and a visible count on the home screen.
- Mastered: a card in Box 5 whose last two reviews were "Got it".
- Exam date (optional, set in Settings): if set, cap every interval at (days until exam minus 1, minimum 1) and show "days until exam" on the home screen.
- Skill-area mastery = percentage of that skill area's cards in Box 4 or 5. Label it "Deck mastery". Do NOT claim it predicts exam results or a pass probability.
- Streak = consecutive local days with at least one review.
- Session queue order: due cards (most overdue first), then trouble cards not already included, then new cards up to the daily limit.

CARD SCHEMA
{ "id", "skill_area", "skill_ref" (the exact outline bullet it maps to), "type" ("definition" | "compare" | "scenario" | "acronym"), "front", "back", "explanation" (why the answer is right, 1 to 3 sentences), "example" (analogy, optional), "confused_with" (array of card ids, optional), "difficulty" (1 to 3), "needs_verification" (boolean) }
- Cover every bullet in the outline with at least 2 cards. The outline has 54 skill bullets by the author's count (14 + 25 + 15); confirm the count in Step 0, which makes the minimum deck 108 cards.
- Include "compare" cards for pairs learners commonly mix up, drawn only from concepts in the outline. When a learner misses a card that has "confused_with" entries, show an "Often confused with" panel on the back.

SCREENS AND UX (it should feel like a real app such as Anki or Duolingo, not a demo)
1. First-run onboarding, 3 steps maximum: welcome and the unofficial notice, optional exam date, daily new-card goal.
2. Home ("Today"): cards due, new cards available, trouble cards, streak, days to exam (if set), one primary button "Start today's session". Deck mastery bars per skill area.
3. Study: large card, flip by tap or Space, answer by buttons or keys 1/2/3, progress bar, undo last answer, end-of-session summary (reviewed, got it, missed, boxes moved, tomorrow's due count).
4. Study by skill area, and a Trouble cards mode.
5. Browse: search, filter by skill area, box, or needs-review; view any card.
6. Progress: mastery per skill area, cards per box, 14-day review history, drawn with inline SVG (no chart library).
7. Settings: daily goal, exam date, dark/light/system theme, export progress to a JSON file, import it back (progress lives only on one device, so this is the backup), reset with confirmation.
Design: mobile-first, works from 360px wide; design tokens in CSS variables; 8px spacing grid; a restrained palette with one accent colour; visible focus states; WCAG AA contrast; 44px minimum tap targets; card flip animation that respects prefers-reduced-motion; empty states and error states written for every screen. Avoid generic gradient hero sections and avoid Microsoft's visual identity.

WORKING METHOD (follow this order, one step per reply, then stop and wait for me to type "next")
Step 0. Read the outline. Confirm the bullet count. Output a coverage table: each outline bullet, planned number of cards, card types. List your assumptions. No code yet.
Step 1. Deck data: the JSON schema file, then ONE skill area's cards per reply, until all areas are done. After the last area, output the verification report: every card with needs_verification true, and the total card count per skill area.
Step 2. The learning engine as a standalone module plus a tests file runnable with "node tests.js". Tests must cover: each of the 3 answer buttons, box limits, the re-queue rule, trouble-card detection, mastered detection, exam-date interval capping, streak across a missed day, and local-day boundaries. Show the test output you expect.
Step 3. Design system: index.html shell, styles.css with tokens, and the router.
Step 4. Screens, one or two per reply, wired to the engine.
Step 5. Service worker, manifest, export/import, and a final accessibility and offline check.
Step 6. README.md (problem, users, features, how to run, deploy to GitHub Pages step by step, architecture, how the deck was verified, known limitations, how to add another certification) and PITCH.md (a 6-slide outline: problem, solution demo, target users, impact and scalability, tech and prompting approach, roadmap).

OUTPUT RULES
- Give each file in its own code block, headed by its exact path.
- At the end of every step, run a self-check: list any rule above that your output might break, and fix it before sending.
- If an instruction is unclear, state your assumption in one line and continue. Do not ask more than one question per reply.
- Do not summarise or restate this brief. Start with Step 0.
```

## What happened when it was run

**Qwen Coder (built the deployed app).** Qwen did not follow two instructions:

- **Stack.** The prompt asked for plain HTML, CSS and JavaScript with no framework. Qwen said it was adapting to its environment (React, Vite and Tailwind) and built in that stack.
- **Method.** The prompt asked for one step per reply and to stop at Step 0. Qwen started building at once and produced the whole project in one run.

The result still worked: the learning engine, the screens, offline mode and the card schema all came out as specified, and the app is deployed. The content rules were followed only partly. Qwen set `needs_verification` to `false` on every card, including ones that later proved wrong.

**Claude (test run of Step 0 only).** In a separate chat, Claude followed the method exactly. It confirmed 54 outline bullets, produced a per-bullet coverage table (a plan of 144 cards), listed its assumptions, flagged the eight bullets most likely to need verification, and stopped. That run showed the prompt's structure works with a model that obeys it. The final app did not come from this chat, because free-tier limits made a full build there impractical.

## Review of the output

Because the prompt could not guarantee accuracy by itself, the generated deck was reviewed afterwards against Microsoft Learn and other web sources, with Claude's help.

- Qwen's first deck had about 110 cards.
- In a first pass over 17 cards on the topics most likely to be wrong, 7 had factual problems (for example AzCopy's supported services, how reading from a GRS secondary works, Azure Germany as a sovereign-region example, and outdated Defender for Cloud and Purview descriptions).
- The whole file was then corrected, every `skill_ref` was set to the exact outline wording, and cards were added so that every bullet has at least two. The deck now has 132 cards.
- The plain definition cards were read through but not each looked up, so errors may remain.

## Changes between v1 and v2

- The placeholder for the outline was replaced with the official outline text.
- The prompt now states the bullet count (54) and the resulting minimum deck size (108), and Step 0 asks the model to confirm the count.
- "Domain mastery" was renamed "Skill-area mastery", because the app's topic areas are not the same as the three exam domains.

## What would be changed in a next version

1. **Make the stack a hard stop.** Add: "If your environment cannot produce plain HTML, CSS and JavaScript, stop and tell me in one line. Do not substitute another stack." This instruction would have caught the React switch.
2. **Make the one-step rule explicit about files.** Add: "Do not create or edit any files in Step 0." Qwen ignored the stop because it was running as a coding agent that creates files.
3. **Restrict the verification flag.** Add: "Set `needs_verification` to `false` only for facts that appear word for word in the outline or that you can state without any doubt. When a card contains a product capability, a list of supported services or a comparison, set it to `true`." Qwen set every card to `false`.
4. **Ask for a validation script.** Require a small script that checks unique ids, valid `confused_with` links, exact `skill_ref` values and at least two cards per outline bullet, so coverage is proven by running it and not by the model's own statement. This was done manually here and found one bullet with only one card.
5. **Define the skill areas.** State the exact list of topic areas, or use the three exam domains, so the app's mastery bars match the exam structure.
6. **Ask for the manifest icons.** Require the icon files, so install-to-home-screen works.
