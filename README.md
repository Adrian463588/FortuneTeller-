# Mystical Fortune Teller 🔮

A modern, database-free web application that generates personalized, highly detailed divination readings and compatibility matching using a combination of ancient world traditions. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🌟 Overview

This application acts as a comprehensive, deterministic oracle and cosmic matchmaker. By inputting a name, date of birth, time of birth, and gender, the algorithm synthesizes a full life profile. It can also analyze the relationship between two individuals across multiple distinct divination systems, predict auspicious wedding dates, and recommend ideal life partners, friends, or colleagues.

**Key Constraint & Innovation:** The app is entirely stateless and database-free. All calculations—including complex multi-person compatibility algorithms—use pure mathematical functions and a custom **seeded random number generator (RNG)**. The seed is derived deterministically from the user's exact inputs. This guarantees that a user will always receive the exact same "randomized" reading or recommendation ranking, delivering the illusion of a persistent, destiny-bound result without ever saving data to a server.

## ✨ Features

- **Multi-System Divination Engine:**
  - **Western Zodiac:** Sun signs, traits, elemental qualities, classical trines, and sextile aspects.
  - **Chinese Zodiac (Shio):** Animal signs, elements, yin/yang balance, San He (Three Harmony) trines, and Liu He (Six Harmony) pairs.
  - **Saju Palja / BaZi (Four Pillars):** Heavenly Stems, Earthly Branches, Day Master, Five Elements (Wuxing) balance, Ten Gods (十神), Shen Sha (神煞 - 10 curated symbolic stars), and Yong Shen (用神 - the Useful God balancing element).
  - **Javanese Primbon:** Weton (Day + Pasaran) and Neptu calculations yielding specific life fortunes.
  - **Feng Shui:** Kua number calculation yielding lucky/unlucky compass directions and aesthetic element recommendations.

- **Deep Time-Based Predictions:**
  - **Current State:** Domain-specific readings (Wealth, Romance, Vitality, Social).
  - **Yearly Forecast:** A 10-year outlook featuring a "Misfortune Index", lucky/challenge months, and structured actionable advice.
  - **Decade Blueprint:** A lifelong timeline highlighting major life phases, milestones, strategy advice, and a sensitive "Transition & Renewal" theme.

- **Match & Marry (He Hun 合婚) Compatibility Engine:**
  - Analyzes the interactions between two people across BaZi, Weton, Zodiac, and Shio.
  - Produces a combined relationship score and dedicated Primbon marriage classes (e.g., Pegat, Ratu, Jodoh).
  - Generates a Relationship Timeline predicting easier and harder periods over decades based on luck cycle interactions.

- **Wedding Date Finder (Ze Ri 择日) Engine:**
  - Deterministically generates candidate dates within a range and filters out those clashing with the couple's BaZi pillars.
  - Scores remaining dates based on Day Master support, Yong Shen alignment, Shen Sha stars (e.g., Heavenly Happiness, Red Phoenix), and auspicious Javanese days.

- **Recommendation Engine (Ideal Matches):**
  - **Modes:** Romance, Friend, and Colleague.
  - Recommends the top 5 most compatible Western Zodiac and Chinese Shio signs if you're single or just looking for the perfect business partner.
  - **Colleague Extras:** Assigns work roles (e.g., Target Initiator, Stabilizer) and predicts collaboration risks with concrete mitigation strategies.

- **Immersive UI/UX:**
  - Premium "mystical dark mode" aesthetic with gold, cyan, pink, and purple accents.
  - Smooth Framer Motion animations: glowing orbs merging into convergence rings, dynamic starfields, and staggered reveals.
  - **Safety UX:** Sensitive topics are protected behind an affirmative "blur-to-reveal" acknowledgment modal.
  - Reduced-motion mode and fully accessible navigation.

- **Recent Bug-Fix & UX Hardening Sprint:**
  - **Input Validation:** Strict date boundaries (1900-today), name character restrictions, and multi-space collapsing. Invalid fields trigger a Framer Motion shake effect with accessible inline error messages.
  - **Mobile Safe Area Navigation:** The `<FloatingNav />` intelligently docks above the footer using CSS `position: sticky` and `env(safe-area-inset-bottom)`, preventing iOS home indicator collisions.
  - **Stable React Renders:** Fully deterministic composite keys applied to all complex list renders (Decade and Yearly tabs) to eliminate duplicate key warnings during procedural generation.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router
│   ├── compatibility/    # Match & Marry page (He Hun)
│   ├── dates/            # Wedding Date Finder page (Ze Ri)
│   └── globals.css       # Core styling, including .input-mystic glows
├── components/           # React Components
│   ├── tabs/             # Dashboard tab views (Overview, Personality, Matches, etc.)
│   ├── ui/               # Reusable primitives
│   ├── AuspiciousCalendar.tsx # Interactive calendar for date selection
│   ├── CompatibilityDashboard.tsx # Results dashboard for couple compatibility
│   ├── CoupleForm.tsx    # Dual-input stepper form for partners
│   ├── HeroForm.tsx      # Landing page input form
│   ├── FloatingNav.tsx   # Floating bottom navigation bar
│   ├── MergeAnimation.tsx# Mystical transition animation for compatibility
│   └── ResultsDashboard.tsx # Main output layout manager for individual destiny
└── utils/                # Core Logic
    ├── compatibilityEngine.ts  # He Hun compatibility scoring across 4 systems
    ├── divinationEngine.ts     # The heart of the app (Calculations & Seeded RNG)
    ├── recommendationEngine.ts # Ideal match suggestions (Shio, Zodiac, modes)
    ├── zeRiEngine.ts           # Date selection logic mapping the cosmic calendar
    └── types.ts                # Comprehensive TypeScript interfaces
```

## 🔮 How the Engine Works

The core logic heavily relies on pure deterministic functions grouped across the `utils/` directory:

1. **Input Hashing:** The user's name, DOB, and time are hashed into a deterministic integer.
2. **Seeded RNG:** The resulting integer initializes a Pseudo-Random Number Generator.
3. **Hard Astrological Math:** Real astrological and calendrical math (converting dates to Heavenly Stems and Earthly Branches, mapping Javanese Weton, assessing San He/Liu He interactions, assigning element combinations) is calculated locally.
4. **Deterministic Synthesis:** For qualitative outputs, the engine utilizes the Seeded RNG to pick from vast template arrays. Two people entering their exact same details down to the minute will always get the same readings securely and safely, without leaving a trace on a server.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Adrian463588/FortuneTeller-.git
   cd FortuneTeller-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. Use the bottom floating nav to switch between the individual Fortune reading, the multi-person Compatibility Matcher, and the Wedding Date Planner.

## ⚠️ Disclaimer

This application is built for **entertainment, educational, and spiritual exploration purposes only**. The readings are algorithmically generated deterministically and should not be taken as factual, medical, legal, or financial advice. 
