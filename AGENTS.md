# Mona Scavenger Hunt — Agent Instructions

## Project Context
This is a React + TypeScript scavenger hunt game themed around GitHub's mascot Mona.
The app uses Vite for development, Framer Motion for animations, and Vitest for testing.

## Code Style
- Use functional React components with hooks
- Prefer named exports over default exports
- Use TypeScript strict mode — no `any` types
- Component files should be PascalCase, utility files should be camelCase
- Keep components under 150 lines; extract hooks for complex logic

## Architecture Rules
- Game state lives in a React context provider (`GameProvider`)
- Scoring logic is pure functions in `src/utils/scoring.ts` (no side effects)
- Clue data is static JSON — do not fetch from an API
- Animations use Framer Motion variants, not CSS transitions

## Testing
- Run tests with `npm test`
- Scoring functions must have 100% branch coverage
- Component tests use React Testing Library

## Known Issues
- Timer continues running when browser tab is inactive
