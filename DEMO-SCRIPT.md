# Mona Scavenger Hunt — Demo Script

> Paste each prompt **one at a time** after the previous response completes.
> Use a screen recorder (OBS, Windows Terminal recording, etc.) to capture.

---

## Pre-Demo Setup (run once before recording)

```
cd C:\Users\miconeill\copilot-cli\mona-scavenger-hunt
copilot
```

Then inside Copilot CLI:
```
/settings set statusline.user false
/settings set statusline.cwd false
```

---

## DEMO START — Paste these in order

### 1. Show context awareness
```
What is this project and what are the known issues?
```
> **Expected:** Copilot reads README, AGENTS.md, and summarizes the scavenger hunt + lists known bugs.

---

### 2. Show issue integration
```
gh issue list
```
> **Expected:** Shows 5 issues in the terminal. Sets up the next step.

---

### 3. Plan a feature (shows /plan)
```
/plan Plan the implementation for issue #5 — the game completion results screen
```
> **Expected:** Copilot creates an implementation plan with steps, components, and architecture decisions.

---

### 4. Start coding from the plan (then background it)
```
Implement the results screen from the plan. Create the component in src/components/ResultsScreen.tsx
```
> **Wait 3-5 seconds for it to start, then press:** `Ctrl+X → B`
> **Expected:** Task moves to background. You're back at the prompt.

---

### 5. Show parallel work (tabs)
```
Fix #3 — make the answer matching case-insensitive
```
> **Wait 3-5 seconds, then press:** `Ctrl+X → B`

---

### 6. Show tasks running
```
/tasks
```
> **Expected:** Both tasks visible running in parallel.

---

### 7. Rubber Duck — THE MAIN EVENT
```
Review src/utils/scoring.ts — look for bugs, logic errors, and edge cases that could break the game. Focus on correctness, not style.
```
> **Expected:** Rubber duck finds 5 bugs:
> - Off-by-one error (i <= events.length should be <)
> - Negative scores possible (no floor/clamp)
> - Negative elapsed time gives free bonus points
> - Streak multiplier checked before reset
> - Tie-breaking is broken in leaderboard sort

---

### 8. Review a PR (shows /review with real PR)
```
Review PR #6 — does this fix fully address the scoring bugs from issue #1?
```
> **Expected:** Copilot reads the PR diff, notes it only fixes the off-by-one but misses the other 4 bugs. High-signal feedback.

---

### 9. (Optional) Show /diff after work completes
```
/diff
```
> **Expected:** Shows all changes made across both background tasks.

---

## END OF DEMO

---

## Talking Points

| Feature Shown | Key Message |
|---|---|
| Context awareness | "Copilot reads your repo instructions automatically" |
| Issue references (#) | "Reference any issue and Copilot reads it" |
| /plan | "Think before you code — plan first" |
| Background tasks | "Work on multiple things at once" |
| /tasks | "See everything running in parallel" |
| Rubber duck | "High-signal review — bugs only, no style noise" |
| PR review | "Review PRs without leaving the terminal" |

---

## If Something Goes Wrong

- Task fails? Just re-paste the prompt.
- Need to reset? `/clear` starts fresh.
- Lost the session? `/resume` to come back.
- Identity showing? `/settings set statusline.user false`
