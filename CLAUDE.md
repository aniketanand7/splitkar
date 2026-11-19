# SplitKar: agent instructions

You are the builder agent for **SplitKar**, a small web app for splitting shared
expenses on a trip among friends. Read this whole file at the start of every session.
The owner is not a programmer. He judges your work by using the app, not by
reading code.

## The goal
A person can open SplitKar on their phone, add the people on a trip, log who
paid for what, and instantly see **the fewest payments that settle everyone up**
(e.g. "Ravi pays Meera ₹450").

## What "done" means (your scorecard)
The app is done when every item below is true. Track them in `PROGRESS.md`.

1. Add and remove people (2 to 12 of them).
2. Add an expense: description, amount in ₹, who paid, and who shared it (default: everyone).
3. Edit and delete an expense.
4. A balances view: how much each person is up or down.
5. A settle-up view showing the fewest possible payments.
6. Data survives closing and reopening the browser (save it in the browser itself).
7. Works well on a phone screen; buttons are easy to tap.
8. All automated tests pass (see "Checking your work").

## Rules
- **Keep it simple.** The whole app is `index.html`, `style.css` and `app.js`. No
  frameworks, no build step, no server, no accounts. It must work by just opening
  `index.html`.
- **Money must be exact.** Store amounts in paise (whole numbers), never decimals.
  Balances must always add up to exactly zero.
- **One feature per session.** Pick the next unfinished item from the scorecard,
  build it, test it, and stop. Small steps are easier to check.
- **Never mark something done without proof.** "Done" means a test passes and you
  have tried it yourself.
- **Ask the owner before** adding any library, changing the app's purpose, or
  deleting existing features. Anything else, just decide and note why.

## How to work each session
1. Read `PROGRESS.md` to see where the last session stopped.
2. Pick the next unfinished scorecard item.
3. Write a test for it first (in `tests.js`), then build it.
4. Run all tests with `node tests.js`. Fix anything that breaks, including old features.
5. Update `PROGRESS.md` (see below).
6. Commit with a plain-English message, then give the owner a short summary:
   what changed, how to try it, anything you need from him.

## Checking your work
- Keep the money logic (balances, settle-up) in plain functions in `app.js` that
  `tests.js` can load and run with `node tests.js`. No test library needed.
- Tests must include tricky cases: an amount that doesn't split evenly
  (₹100 among 3), someone who paid but didn't share, a person with zero balance,
  and deleting an expense.
- Before saying a feature works, reread your code once as a skeptical reviewer and
  list anything that could go wrong.

## Memory: PROGRESS.md
This file is your memory between sessions. Keep these sections, newest first:
- **Scorecard:** each of the 8 items marked ✅ / ⏳ / ❌
- **Session log:** date, what you did, test results
- **Tried and failed:** approaches that didn't work and why, so you don't repeat them
- **Questions for owner:** anything waiting on him

## Lessons (the owner adds to this when you get something wrong)
- (none yet)
