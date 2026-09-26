# Redesign notes — 2026-09-26

A record of what changed in the site redesign and, more importantly, *why* —
so the reasoning isn't lost once the chat that produced it is gone.

## Design concept

The site is built around a financial-ledger/statement visual identity:
green-bar row striping (pulled from real accounting "green-bar" printer
paper), tabular mono figures for every date/number, "§ N" section marks
instead of generic numbered eyebrows, and ink-stamp button/hover states.

Reasoning: the personal pitch is "most analysts learn to read a P&L, I built
them for 9+ years" — the design should look like the kind of document that
career actually produces, not a generic AI-portfolio template (cream
background + serif + terracotta accent, or a SaaS card grid). Every visual
device maps to a real ledger convention rather than being decoration.

## Content accuracy corrections made against the actual CV

The live site (before this redesign) and the CV PDF had drifted apart. The
CV was treated as the source of truth:

- "Over a decade" in finance → corrected to "9+ years" everywhere (hero
  tagline, About copy, hero stat counter), matching the CV's own wording.
- Added the current Doctolib internship (People Strategy Business Analyst,
  Jul–Dec 2026) that wasn't on the old live site at all — this is the
  reason "available from Jan 2027" makes sense (it's right after this
  internship ends, per the CV's own summary line).
- Location changed from Bordeaux to Paris (CV's actual current address is
  Aubervilliers/Paris; KEDGE's Bordeaux campus is where the MSc is based,
  not where he currently lives).
- MSc end date changed from "Present" to the CV's actual "Apr 2027".

## Certifications — linking decisions

All five certificates got real verification links, extracted from the CV
PDF's embedded link annotations (via `strings`/regex on the raw PDF, not
guessed) or supplied directly:

- Google Data Analytics → Coursera share link
- SQL Associate, Power BI (DAX/Power Query), Data Analyst Associate →
  DataCamp (extracted from PDF)
- Machine Learning Fundamentals → DataCamp (link supplied directly later
  in the session, after initially shipping without one since it wasn't in
  the PDF)

Caveat: DataCamp's certificate pages return HTTP 403 to `curl` (bot
protection), so I could not independently confirm they resolve from this
environment — high confidence they're correct since they came straight out
of the PDF's own link annotations, but worth a manual click-check.

## Education section — institution/program links

Searched for and linked each institution's site plus, where confidently
identifiable, the specific program page:

- KEDGE → main site + the actual MSc program page (`student.kedge.edu/...`)
- Universitas Terbuka → main site + current program page (note: the old
  `fe.ut.ac.id` domain no longer resolves; used the current `feb.ut.ac.id`)
- Miami Dade College: **did not** link a specific certificate page on the
  first pass — MDC's current catalog didn't have an exact match for the
  CV's stated certificate name, and linking a plausible-but-wrong program
  page seemed worse than no link. Corrected once Edwin clarified in
  person: it was actually **two** concurrent certificates ("Business
  Operations" and "Business Specialist"), both under MDC's Accounting &
  Budgeting program — he supplied the exact URL
  (`mdc.edu/accountingbudgeting/`), which is now used for both.
- The Community College Initiative Program mention links to
  `exchanges.state.gov/non-us/program/community-college-initiative-program`
  — initially linked to a different (also legitimate) EducationUSA page,
  swapped to this one per Edwin's explicit preference.

**Lesson embedded here:** when a specific credential/program name can't be
confidently matched to a live page, say so and link the parent institution
instead of guessing — don't present an unverified match as verified.

## Projects section — what got added and why

Audited Edwin's public GitHub repos (`richhuwae`) since the old live site
had four placeholder "in progress" projects with no real work behind them.
Findings and outcome:

| Repo | Verdict | Included? |
|---|---|---|
| `consumer-revenue-intelligence` | Already featured, real completed project | Yes (unchanged) |
| `semishocks` | EU semiconductor PPI/IPI event-study dashboard (Eurostat data, real geopolitical events, Streamlit+Plotly) — strong fit for the finance/data brand | **Yes** — replaced "Finance Forecast & Variance Explorer" placeholder |
| `carbon-compass-extension` | Polished Chrome extension tracking AI carbon/water footprint (SDG 13) — off-brand (climate tech, not finance/BI) but well-documented, shows range | **Yes**, Edwin chose to include it despite the brand mismatch |
| `semirisk` | Companion to semishocks — news-based geopolitical supply-risk scoring, also strong/relevant | **No** — Edwin didn't select it when asked; could revisit |
| `careerzo` | Figma-Make-exported career tracker scaffold, thin/boilerplate README, couldn't verify real substance | **No** — flagged as not recommended, Edwin agreed |

Two placeholders ("After-Sales Performance Dashboard", "Customer Churn &
Retention Analysis") remain as "In progress" since no real repo matched
them — they're honest placeholders, not fabricated projects.

## The interactive chart detour (built, then fully removed)

At one point I built a complete working prototype: a hand-rolled SVG line
chart (no external chart library) embedded directly in the semishocks
project card, showing real PPI/IPI data per country vs. an EU baseline,
with hover/keyboard interaction, event markers, and a table-view fallback
for accessibility. It worked, but Edwin's reaction was "not sure it adds
value, just delete it" — no partial iteration requested, a clean removal.

**Takeaway:** for this portfolio, prefer simple static presentation over
impressive-but-unrequested interactive features. If asked to "sketch"
something again, that likely means "show me a concrete option to react
to," not "build and ship the full version."

## Accessibility fixes found during the final QA pass

- `--ink-faint` (used for dates, table headers, project tags, contact
  labels, footer) had only a 3.28:1 contrast ratio against the paper
  background in light mode — fails WCAG AA (needs 4.5:1) for normal text.
  Darkened to `#5F7063` (light) / `#7C9182` (dark) → 4.87:1 / 5.01:1.
- Minor CSS specificity cleanups (`.ledger-row--head` background override,
  `.pending__tools` color) to avoid relying on `!important`.
- Verified all internal anchors, no duplicate IDs, no orphaned CSS/JS after
  the chart removal.

## Favicon

Generated from scratch (SVG + ICO + PNG + apple-touch-icon) to match the
masthead's stacked "E / R / H" mark exactly — same ink background, paper
letters, hairline dividers between letters.

## Analytics

The previous live site had a Simple Analytics snippet already installed
(found by fetching and inspecting the live HTML directly). Carried the
identical snippet over — it's privacy-friendly (no cookies, no personal
data), and Simple Analytics identifies sites by domain rather than an
embedded site ID, so it works unchanged once deployed to the same domain.

## Deployment mechanics

The live site is GitHub Pages, repo `richhuwae/edwinrichardhuwae.github.io`,
custom domain via its `CNAME` file. This machine had **zero** GitHub auth
set up (no SSH keys, no git config, no `gh` CLI) — had to install `gh` via
Homebrew and have Edwin run `gh auth login` interactively before anything
could be pushed. Also discovered the local `personal-website/` working
folder was never itself a git repository (it was a plain, untracked
directory the whole time) — fixed by properly `git init` + linking it to
the same `origin` remote, so future edits here are version-controlled and
deployable with a plain `git push origin main`.
