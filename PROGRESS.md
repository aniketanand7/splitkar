# SplitKar progress

## Scorecard
1. ✅ Add and remove people (2 to 12 of them)
2. ❌ Add an expense (description, ₹ amount, who paid, who shared; default everyone)
3. ❌ Edit and delete an expense
4. ❌ Balances view
5. ❌ Settle-up view with the fewest payments
6. ❌ Data survives closing and reopening the browser
7. ⏳ Works well on a phone: done for the People screen (48px tap targets, 16px inputs so iPhone doesn't zoom); recheck as features are added
8. ⏳ All automated tests pass: 13/13 today; stays ⏳ until the app is finished

## Session log
### 2026-11-19: Session 1: People
- Created the app skeleton: `index.html`, `style.css`, `app.js`, `tests.js`.
- Built add/remove people. Rules decided (owner can change these):
  - Names are trimmed; blank, over-30-letter, and duplicate names (ignoring capitals) are refused with a friendly message.
  - Max 12 people: the Add box disables when full.
  - The "minimum 2" is a hint ("Add at least one more person…"), not a block. You can remove
    down to zero, because a hard block would trap you with a typo'd name. Later features
    (adding expenses) will require 2+ people via `hasEnoughPeople()`.
  - Can't remove someone who appears in an expense (paid or shared). The message tells you to
    change/delete that expense first. This keeps the money exact.
  - Each person has a numeric id that is never reused, so expenses point at ids, not names.
- Tests: `node tests.js`: 13 passed, 0 failed.
- Tried it in a headless phone-sized browser (Pixel 5): add, duplicate, HTML-looking name,
  remove, fill to 12. No page errors.

## Tried and failed
- (nothing yet)

## Questions for owner
- None blocking. Optional: are the rules above (min-2 as a hint, 30-letter names) OK?
