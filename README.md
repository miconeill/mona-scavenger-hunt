# 🐙 Mona's Scavenger Hunt

A scavenger hunt app inspired by GitHub's mascot **Mona the Octocat**. Players race to find hidden Monas scattered across challenges, earn points, unlock hints, and climb the leaderboard.

## 🎮 How It Works

1. **Start a Hunt** — Choose a difficulty level (Intern, Contributor, Maintainer)
2. **Find Monas** — Each clue leads to a hidden Mona. Solve the riddle, find the octocat.
3. **Use Hints** — Stuck? Spend points to unlock hints (but it costs you!)
4. **Race the Clock** — Faster finds earn bonus points
5. **Climb the Board** — Compete for the top spot on the leaderboard

## 🏗️ Architecture

```
src/
├── components/     # React UI components
├── data/           # Clue definitions and game config
├── hooks/          # Custom React hooks
├── utils/          # Scoring, timing, and game logic
└── types/          # TypeScript type definitions
```

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 🎯 Scoring

| Action | Points |
|--------|--------|
| Find a Mona | +100 |
| Time bonus (under 30s) | +50 |
| Time bonus (under 60s) | +25 |
| Use a hint | -20 |
| Complete a streak (3+) | ×1.5 multiplier |

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite for bundling
- Framer Motion for animations
- Vitest for testing
