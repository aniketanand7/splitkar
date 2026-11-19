// SplitKar tests. Run with: node tests.js
// No test library: each test is a function; any thrown error is a failure.

const app = require('./app.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ok   ' + name);
  } catch (err) {
    failed++;
    console.log('  FAIL ' + name + '\n       ' + err.message);
  }
}

function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error((label ? label + ': ' : '') + 'expected ' + e + ', got ' + a);
}

function assertThrows(fn, messagePart) {
  let threw = false;
  try {
    fn();
  } catch (err) {
    threw = true;
    if (messagePart && !err.message.includes(messagePart)) {
      throw new Error('expected error containing "' + messagePart + '", got "' + err.message + '"');
    }
  }
  if (!threw) throw new Error('expected an error, but none was thrown');
}

function names(state) {
  return state.people.map(function (p) { return p.name; });
}

// ---------- People (scorecard item 1) ----------
console.log('People');

test('a new trip starts with nobody', function () {
  const s = app.createState();
  assertEqual(s.people, []);
  assertEqual(s.expenses, []);
});

test('add a person', function () {
  const s = app.addPerson(app.createState(), 'Ravi');
  assertEqual(names(s), ['Ravi']);
});

test('names are trimmed and inner spaces tidied', function () {
  const s = app.addPerson(app.createState(), '   Meera   Rao  ');
  assertEqual(names(s), ['Meera Rao']);
});

test('blank name is rejected', function () {
  assertThrows(function () { app.addPerson(app.createState(), '   '); }, 'name');
});

test('duplicate name is rejected, ignoring capital letters', function () {
  const s = app.addPerson(app.createState(), 'Ravi');
  assertThrows(function () { app.addPerson(s, 'ravi'); }, 'already');
});

test('very long name is rejected', function () {
  assertThrows(function () { app.addPerson(app.createState(), 'x'.repeat(31)); }, 'long');
});

test('each person gets a different id, even after removals', function () {
  let s = app.createState();
  s = app.addPerson(s, 'A');
  s = app.addPerson(s, 'B');
  const idB = s.people[1].id;
  s = app.removePerson(s, idB);
  s = app.addPerson(s, 'C');
  const ids = s.people.map(function (p) { return p.id; });
  assertEqual(new Set(ids).size, 2, 'unique ids');
  if (ids.includes(idB)) throw new Error('a removed id was reused');
});

test('can add up to 12 people, but not a 13th', function () {
  let s = app.createState();
  for (let i = 1; i <= 12; i++) s = app.addPerson(s, 'P' + i);
  assertEqual(s.people.length, 12);
  assertThrows(function () { app.addPerson(s, 'P13'); }, '12');
});

test('remove a person', function () {
  let s = app.createState();
  s = app.addPerson(s, 'Ravi');
  s = app.addPerson(s, 'Meera');
  s = app.removePerson(s, s.people[0].id);
  assertEqual(names(s), ['Meera']);
});

test('removing someone who does not exist is an error', function () {
  assertThrows(function () { app.removePerson(app.createState(), 999); }, 'not found');
});

test('cannot remove someone who is part of an expense', function () {
  let s = app.createState();
  s = app.addPerson(s, 'Ravi');
  s = app.addPerson(s, 'Meera');
  const ravi = s.people[0].id;
  const meera = s.people[1].id;
  // Expenses feature comes later; put one in by hand to test the safety check.
  s.expenses = [{ id: 1, description: 'Taxi', amountPaise: 30000, paidBy: meera, sharedBy: [ravi, meera] }];
  assertThrows(function () { app.removePerson(s, ravi); }, 'expense');
  assertThrows(function () { app.removePerson(s, meera); }, 'expense');
});

test('adding and removing do not change the old state', function () {
  const s0 = app.createState();
  const s1 = app.addPerson(s0, 'Ravi');
  app.removePerson(s1, s1.people[0].id);
  assertEqual(s0.people, []);
  assertEqual(names(s1), ['Ravi']);
});

test('enough people to split needs at least 2', function () {
  let s = app.createState();
  assertEqual(app.hasEnoughPeople(s), false);
  s = app.addPerson(s, 'Ravi');
  assertEqual(app.hasEnoughPeople(s), false);
  s = app.addPerson(s, 'Meera');
  assertEqual(app.hasEnoughPeople(s), true);
});

// ---------- Summary ----------
console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) process.exit(1);
