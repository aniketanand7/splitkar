// SplitKar app logic.
// Top part: plain functions with no browser code, so tests.js can run them in Node.
// Bottom part: wires those functions to the page (only runs in a browser).
//
// State shape:
//   { people: [{ id, name }], expenses: [...], nextId }
// Functions never change the state they are given; they return a new one.

var MAX_PEOPLE = 12;
var MIN_PEOPLE = 2;
var MAX_NAME_LENGTH = 30;

function createState() {
  return { people: [], expenses: [], nextId: 1 };
}

function cleanName(name) {
  return String(name == null ? '' : name).trim().replace(/\s+/g, ' ');
}

function addPerson(state, rawName) {
  var name = cleanName(rawName);
  if (name === '') throw new Error('Please type a name.');
  if (name.length > MAX_NAME_LENGTH) {
    throw new Error('That name is too long (max ' + MAX_NAME_LENGTH + ' letters).');
  }
  if (state.people.length >= MAX_PEOPLE) {
    throw new Error('A trip can have at most ' + MAX_PEOPLE + ' people.');
  }
  var lower = name.toLowerCase();
  var existing = state.people.find(function (p) { return p.name.toLowerCase() === lower; });
  if (existing) throw new Error(existing.name + ' is already on the trip.');

  var id = state.nextId;
  return Object.assign({}, state, {
    people: state.people.concat([{ id: id, name: name }]),
    nextId: id + 1
  });
}

function personIsInAnyExpense(state, id) {
  return state.expenses.some(function (e) {
    return e.paidBy === id || (e.sharedBy || []).indexOf(id) !== -1;
  });
}

function removePerson(state, id) {
  var person = state.people.find(function (p) { return p.id === id; });
  if (!person) throw new Error('Person not found.');
  if (personIsInAnyExpense(state, id)) {
    throw new Error(person.name + ' is part of an expense. Delete or change that expense first.');
  }
  return Object.assign({}, state, {
    people: state.people.filter(function (p) { return p.id !== id; })
  });
}

function hasEnoughPeople(state) {
  return state.people.length >= MIN_PEOPLE;
}

// ---------- Export for tests (Node) ----------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MAX_PEOPLE: MAX_PEOPLE,
    MIN_PEOPLE: MIN_PEOPLE,
    createState: createState,
    addPerson: addPerson,
    removePerson: removePerson,
    hasEnoughPeople: hasEnoughPeople
  };
}

// ---------- Page wiring (browser only) ----------
if (typeof document !== 'undefined') {
  (function () {
    var state = createState();

    var form = document.getElementById('add-person-form');
    var input = document.getElementById('person-name');
    var list = document.getElementById('people-list');
    var message = document.getElementById('people-message');
    var count = document.getElementById('people-count');
    var addButton = form.querySelector('button');

    function showMessage(text, isError) {
      message.textContent = text;
      message.className = 'message' + (isError ? ' error' : '');
    }

    function render() {
      list.innerHTML = '';
      state.people.forEach(function (p) {
        var li = document.createElement('li');
        var span = document.createElement('span');
        span.textContent = p.name; // textContent, so names can't inject HTML
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'remove';
        btn.textContent = 'Remove';
        btn.setAttribute('aria-label', 'Remove ' + p.name);
        btn.addEventListener('click', function () {
          try {
            state = removePerson(state, p.id);
            showMessage('', false);
            render();
          } catch (err) {
            showMessage(err.message, true);
          }
        });
        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
      });

      count.textContent = state.people.length + ' of ' + MAX_PEOPLE;
      var full = state.people.length >= MAX_PEOPLE;
      input.disabled = full;
      addButton.disabled = full;
      input.placeholder = full ? 'Trip is full' : 'Name, e.g. Ravi';

      if (!message.classList.contains('error')) {
        if (state.people.length === 0) showMessage('Add the people on your trip.', false);
        else if (!hasEnoughPeople(state)) showMessage('Add at least one more person to start splitting.', false);
        else showMessage('', false);
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      try {
        state = addPerson(state, input.value);
        input.value = '';
        showMessage('', false);
        render();
        if (!input.disabled) input.focus();
      } catch (err) {
        showMessage(err.message, true);
      }
    });

    input.addEventListener('input', function () {
      if (message.classList.contains('error')) showMessage('', false);
    });

    render();
  })();
}
